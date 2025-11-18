const OpenAI = require('openai');
const ChatConversation = require('../models/ChatConversation');
const Municipality = require('../models/Municipality');
const Schedule = require('../models/Schedule');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIChatService {
  async chat(userId, message, sessionId, municipalityId) {
    try {
      // Get or create conversation
      let conversation = await ChatConversation.findOne({ 
        sessionId, 
        user: userId,
        active: true 
      });

      if (!conversation) {
        conversation = new ChatConversation({
          user: userId,
          sessionId,
          context: { 
            municipality: municipalityId,
            language: 'en'
          },
          messages: []
        });
      }

      // Get municipality-specific context
      const municipality = await Municipality.findById(municipalityId);
      
      if (!municipality) {
        throw new Error('Municipality not found');
      }

      // Get user's schedules
      const schedules = await Schedule.find({ 
        municipality: municipalityId,
        subscribers: userId
      });

      // Build context-aware system prompt
      const systemPrompt = this.buildSystemPrompt(municipality, schedules);

      // Add user message to conversation
      conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Prepare messages for OpenAI (last 10 messages for context)
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective model
        messages,
        temperature: 0.7,
        max_tokens: 500,
        user: userId.toString() // For tracking
      });

      const assistantMessage = completion.choices[0].message.content;
      const tokensUsed = completion.usage.total_tokens;

      // Add assistant response to conversation
      conversation.messages.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
        tokens: tokensUsed
      });

      // Update metadata
      conversation.metadata.totalTokens = 
        (conversation.metadata.totalTokens || 0) + tokensUsed;
      conversation.metadata.model = 'gpt-4o-mini';

      await conversation.save();

      return {
        message: assistantMessage,
        sessionId,
        tokensUsed,
        conversationId: conversation._id
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error(`Failed to process chat: ${error.message}`);
    }
  }

  buildSystemPrompt(municipality, schedules) {
    // Build comprehensive context
    const wasteTypes = municipality.config.wasteTypes
      .map(wt => `- ${wt.type}: ${wt.guidelines}`)
      .join('\n');

    const scheduleInfo = schedules.length > 0
      ? schedules.map(s => {
          const pickups = s.pickups.map(p => 
            `${p.wasteType} on ${this.getDayName(p.dayOfWeek)} at ${p.time}`
          ).join(', ');
          return `Zone ${s.zone}: ${pickups}`;
        }).join('\n')
      : 'No schedules available';

    const facilities = municipality.facilities
      .map(f => `- ${f.name} (${f.type}): ${f.address}`)
      .join('\n');

    const recyclingRules = JSON.stringify(municipality.config.recyclingRules, null, 2);

    return `You are EcoBot, a helpful and friendly waste management assistant for ${municipality.name}.

Your purpose is to help users with:
1. Recycling guidelines and proper waste sorting
2. Collection schedules and pickup times
3. Finding nearby waste facilities
4. Answering questions about sustainability and waste reduction
5. Encouraging eco-friendly practices

**Municipality: ${municipality.name}**

**Waste Types and Guidelines:**
${wasteTypes}

**Collection Schedules:**
${scheduleInfo}

**Recycling Facilities:**
${facilities}

**Detailed Recycling Rules:**
${recyclingRules}

**Instructions:**
- Always be helpful, friendly, and encouraging
- Provide specific, actionable advice
- Use the local context and rules above
- If you don't know something, admit it and suggest contacting ${municipality.config.contactInfo.phone || 'local authorities'}
- Use emojis occasionally to make responses engaging (♻️ 🌱 🗑️ 📅)
- Keep responses concise but informative
- Encourage sustainable practices
- If asked about schedules, provide the exact days and times
- If asked about facilities, provide addresses and accepted materials

Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  }

  getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  }

  async provideFeedback(sessionId, userId, feedback) {
    try {
      const conversation = await ChatConversation.findOne({ 
        sessionId, 
        user: userId 
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      conversation.feedback = {
        rating: feedback.rating,
        helpful: feedback.helpful,
        comment: feedback.comment || ''
      };

      await conversation.save();

      return { success: true, message: 'Thank you for your feedback!' };
    } catch (error) {
      console.error('Feedback error:', error);
      throw error;
    }
  }

  async endSession(sessionId, userId) {
    try {
      await ChatConversation.updateOne(
        { sessionId, user: userId },
        { active: false }
      );

      return { success: true, message: 'Session ended' };
    } catch (error) {
      console.error('End session error:', error);
      throw error;
    }
  }

  async getConversationHistory(userId, limit = 10) {
    try {
      const conversations = await ChatConversation.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('sessionId context createdAt messages.role messages.timestamp');

      return conversations.map(conv => ({
        sessionId: conv.sessionId,
        topic: conv.context.topic,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1]?.timestamp,
        createdAt: conv.createdAt
      }));
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }

  async getChatStats(userId) {
    try {
      const stats = await ChatConversation.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalConversations: { $sum: 1 },
            totalMessages: { $sum: { $size: '$messages' } },
            totalTokens: { $sum: '$metadata.totalTokens' },
            avgMessagesPerConversation: { $avg: { $size: '$messages' } }
          }
        }
      ]);

      return stats[0] || {
        totalConversations: 0,
        totalMessages: 0,
        totalTokens: 0,
        avgMessagesPerConversation: 0
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }
}

module.exports = new AIChatService();
