const axios = require('axios');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  // Analyze waste image using OpenAI Vision
  async analyzeWasteImage(imageUrl) {
    try {
      if (!this.openaiApiKey) {
        console.warn('OpenAI API key not configured, using fallback analysis');
        return this.fallbackAnalysis();
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this waste item and return JSON with:
                  - wasteType: "recyclable", "organic", "e-waste", "hazardous", or "general"
                  - category: specific category like "plastic_bottle", "aluminum_can", etc.
                  - confidence: confidence score 0-1
                  - detectedItems: array of detected items
                  - recyclingTips: array of recycling tips
                  - estimatedWeight: estimated weight in kg
                  
                  Be accurate and environmentally conscious.`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = JSON.parse(response.data.choices[0].message.content);
      return analysis;
    } catch (error) {
      console.error('AI analysis error:', error.message);
      return this.fallbackAnalysis();
    }
  }

  // Fallback analysis when AI is not available
  fallbackAnalysis() {
    return {
      wasteType: 'recyclable',
      category: 'plastic_bottle',
      confidence: 0.7,
      detectedItems: ['plastic_container'],
      recyclingTips: [
        'Rinse container before recycling',
        'Check local recycling guidelines',
        'Remove caps if required'
      ],
      estimatedWeight: 0.02
    };
  }

  // Categorize waste from text description
  async categorizeFromText(description) {
    try {
      if (!this.openaiApiKey) {
        return this.categorizeFromTextFallback(description);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a waste classification expert. Categorize waste items into:
              - type: "recyclable", "organic", "e-waste", "hazardous", or "general"
              - category: specific category
              Return JSON only.`
            },
            {
              role: 'user',
              content: `Categorize: "${description}"`
            }
          ],
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Text categorization error:', error);
      return this.categorizeFromTextFallback(description);
    }
  }

  categorizeFromTextFallback(description) {
    const lowerDesc = description.toLowerCase();
    
    // Simple keyword-based categorization
    if (lowerDesc.includes('plastic') || lowerDesc.includes('bottle') || lowerDesc.includes('can')) {
      return { type: 'recyclable', category: 'plastic_bottle' };
    } else if (lowerDesc.includes('food') || lowerDesc.includes('fruit') || lowerDesc.includes('vegetable')) {
      return { type: 'organic', category: 'food_waste' };
    } else if (lowerDesc.includes('electronic') || lowerDesc.includes('battery') || lowerDesc.includes('phone')) {
      return { type: 'e-waste', category: 'electronics' };
    } else if (lowerDesc.includes('chemical') || lowerDesc.includes('paint') || lowerDesc.includes('oil')) {
      return { type: 'hazardous', category: 'chemicals' };
    } else {
      return { type: 'general', category: 'general_waste' };
    }
  }
}

module.exports = new AIService();