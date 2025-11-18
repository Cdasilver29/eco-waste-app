# Sustainable Waste Management App - Complete Development Plan

## 1. System Architecture Overview

### 1.1 Technology Stack
```
Frontend:
- Web: React 18+ with TypeScript
- Mobile: React Native with TypeScript
- State Management: Redux Toolkit + RTK Query
- UI Framework: Material-UI (web), React Native Paper (mobile)
- Maps: react-map-gl (Mapbox), react-native-maps
- Real-time: Socket.io-client

Backend:
- Runtime: Node.js 18+ LTS
- Framework: Express.js
- Database: MongoDB Atlas (primary), Redis (caching/sessions)
- ODM: Mongoose
- Authentication: JWT + Refresh Tokens
- Real-time: Socket.io
- Queue: Bull (Redis-based job queue)
- File Storage: AWS S3 / Cloudinary

AI/ML Services:
- Chatbot: OpenAI GPT-4 API / Anthropic Claude
- Image Recognition: TensorFlow.js + Custom CNN model
- Forecasting: Python microservice (FastAPI) with scikit-learn/Prophet
- Vector DB: Pinecone/Weaviate for RAG chatbot

Infrastructure:
- Hosting: AWS/GCP/Azure
- Container: Docker + Kubernetes
- CI/CD: GitHub Actions
- Monitoring: Sentry, DataDog
- Analytics: Mixpanel, Google Analytics
```

### 1.2 High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  React Web   │              │ React Native │            │
│  │  (PWA Ready) │              │   (iOS/Android)│           │
│  └──────┬───────┘              └──────┬────────┘           │
└─────────┼──────────────────────────────┼──────────────────┘
          │                              │
          └──────────────┬───────────────┘
                         │ HTTPS/WSS
          ┌──────────────▼──────────────┐
          │     API Gateway/Load         │
          │       Balancer (NGINX)       │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │   Node.js Express Backend    │
          │   ┌──────────────────────┐  │
          │   │  Auth Middleware     │  │
          │   │  Rate Limiting       │  │
          │   │  Validation          │  │
          │   └──────────┬───────────┘  │
          │              │               │
          │   ┌──────────▼───────────┐  │
          │   │   Controller Layer   │  │
          │   └──────────┬───────────┘  │
          │              │               │
          │   ┌──────────▼───────────┐  │
          │   │   Service Layer      │  │
          │   └──────────┬───────────┘  │
          └──────────────┼──────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   MongoDB   │  │    Redis    │  │  Bull Queue │
│   Cluster   │  │   Cache     │  │  (Jobs)     │
└─────────────┘  └─────────────┘  └──────┬──────┘
                                          │
                                  ┌───────▼──────┐
                                  │ Worker Nodes │
                                  │ - Emails     │
                                  │ - Analytics  │
                                  │ - Reports    │
                                  └──────────────┘

       External Services
┌──────────────────────────────────────────┐
│  AI/ML Services    Maps        Notify    │
│  ┌────────┐   ┌─────────┐  ┌─────────┐  │
│  │ OpenAI │   │ Mapbox  │  │ FCM/APNS│  │
│  │ Claude │   │ Google  │  │ Twilio  │  │
│  └────────┘   └─────────┘  └─────────┘  │
│  ┌────────┐   ┌─────────┐  ┌─────────┐  │
│  │TF Model│   │ AWS S3  │  │SendGrid │  │
│  │Service │   │Cloudnry │  │         │  │
│  └────────┘   └─────────┘  └─────────┘  │
└──────────────────────────────────────────┘
```

## 2. Database Schema Design

### 2.1 Core Collections

```javascript
// users.js - User Management
{
  _id: ObjectId,
  email: String, // unique, indexed
  password: String, // bcrypt hashed
  role: String, // enum: ['citizen', 'hauler', 'admin', 'city_manager']
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude] // GeoJSON
      }
    },
    language: String, // i18n
    timezone: String
  },
  gamification: {
    points: Number, // default 0
    level: Number, // default 1
    badges: [{
      badgeId: ObjectId,
      earnedAt: Date
    }],
    streak: {
      current: Number,
      longest: Number,
      lastActivity: Date
    }
  },
  preferences: {
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean,
      reminderHours: Number // hours before pickup
    },
    theme: String // light/dark
  },
  municipality: ObjectId, // ref: Municipality
  verified: Boolean,
  active: Boolean,
  refreshTokens: [String], // for JWT rotation
  createdAt: Date,
  updatedAt: Date
}

// municipalities.js - City/Region Configuration
{
  _id: ObjectId,
  name: String,
  slug: String, // unique, indexed
  country: String,
  region: String,
  boundary: {
    type: 'Polygon',
    coordinates: [[[lng, lat]]] // GeoJSON polygon
  },
  config: {
    wasteTypes: [{
      type: String, // 'recyclable', 'organic', 'e-waste', 'hazardous'
      color: String,
      icon: String,
      guidelines: String
    }],
    schedules: [{
      zone: String,
      wasteType: String,
      days: [Number], // 0-6 (Sunday-Saturday)
      time: String, // '08:00'
      frequency: String // 'weekly', 'biweekly', 'monthly'
    }],
    recyclingRules: Object, // locale-specific rules
    holidays: [Date],
    contactInfo: {
      phone: String,
      email: String,
      website: String
    }
  },
  facilities: [{
    type: String, // 'recycling_center', 'e-waste', 'compost', 'transfer_station'
    name: String,
    address: String,
    location: {
      type: 'Point',
      coordinates: [Number, Number]
    },
    hours: Object,
    acceptedMaterials: [String],
    phone: String
  }],
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// schedules.js - Collection Schedules
{
  _id: ObjectId,
  municipality: ObjectId,
  zone: String, // indexed
  address: String,
  location: {
    type: 'Point',
    coordinates: [Number, Number]
  },
  pickups: [{
    wasteType: String,
    dayOfWeek: Number, // 0-6
    time: String,
    frequency: String,
    nextPickup: Date, // indexed for queries
    route: ObjectId // ref: Route
  }],
  specialCollections: [{
    type: String, // 'bulk', 'hazardous', 'e-waste'
    scheduledDate: Date,
    status: String // 'scheduled', 'completed', 'cancelled'
  }],
  subscribers: [ObjectId], // users who subscribed for reminders
  createdAt: Date,
  updatedAt: Date
}

// routes.js - Hauler Routes & Tracking
{
  _id: ObjectId,
  municipality: ObjectId,
  routeId: String, // unique identifier
  name: String,
  hauler: ObjectId, // ref: User (role: hauler)
  vehicle: {
    id: String,
    type: String,
    licensePlate: String,
    capacity: Number
  },
  wasteType: String,
  zone: String,
  waypoints: [{
    address: String,
    location: {
      type: 'Point',
      coordinates: [Number, Number]
    },
    estimatedTime: Date,
    status: String, // 'pending', 'completed', 'skipped'
    completedAt: Date,
    notes: String
  }],
  status: String, // 'planned', 'in_progress', 'completed'
  scheduledDate: Date,
  startTime: Date,
  endTime: Date,
  currentLocation: {
    type: 'Point',
    coordinates: [Number, Number]
  },
  efficiency: {
    plannedDistance: Number,
    actualDistance: Number,
    fuelUsed: Number,
    wasteCollected: Number // kg
  },
  createdAt: Date,
  updatedAt: Date
}

// waste_logs.js - User Waste Disposal Records
{
  _id: ObjectId,
  user: ObjectId,
  municipality: ObjectId,
  type: String, // waste type
  category: String, // specific category
  weight: Number, // estimated kg
  item: String, // description
  image: String, // S3 URL
  classification: {
    method: String, // 'manual', 'ai_scan'
    confidence: Number, // 0-1 for AI
    suggestions: [String]
  },
  location: {
    type: 'Point',
    coordinates: [Number, Number]
  },
  disposal: {
    method: String, // 'curbside', 'drop_off', 'special'
    facility: ObjectId, // if drop-off
    date: Date
  },
  verified: Boolean, // admin verification
  points: Number, // gamification points earned
  createdAt: Date
}

// gamification.js - Badges & Achievements
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String,
  type: String, // 'milestone', 'streak', 'special'
  criteria: {
    action: String, // 'recycle_count', 'streak_days', 'weight_recycled'
    threshold: Number,
    timeframe: String // 'all_time', 'monthly', 'weekly'
  },
  points: Number,
  rarity: String, // 'common', 'rare', 'epic', 'legendary'
  active: Boolean,
  createdAt: Date
}

// notifications.js - Notification Queue
{
  _id: ObjectId,
  user: ObjectId,
  type: String, // 'pickup_reminder', 'achievement', 'system', 'route_update'
  title: String,
  message: String,
  data: Object, // additional payload
  channels: {
    push: {
      sent: Boolean,
      sentAt: Date,
      token: String
    },
    email: {
      sent: Boolean,
      sentAt: Date
    },
    sms: {
      sent: Boolean,
      sentAt: Date
    }
  },
  scheduled: Date,
  priority: String, // 'low', 'medium', 'high', 'urgent'
  read: Boolean,
  readAt: Date,
  expiresAt: Date,
  createdAt: Date
}

// chatbot_conversations.js - AI Chat History
{
  _id: ObjectId,
  user: ObjectId,
  sessionId: String, // indexed
  messages: [{
    role: String, // 'user', 'assistant'
    content: String,
    timestamp: Date,
    tokens: Number
  }],
  context: {
    municipality: ObjectId,
    language: String,
    topic: String // 'recycling', 'schedule', 'general'
  },
  feedback: {
    rating: Number, // 1-5
    helpful: Boolean,
    comment: String
  },
  metadata: {
    model: String,
    totalTokens: Number
  },
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// analytics.js - Aggregated Analytics
{
  _id: ObjectId,
  municipality: ObjectId,
  period: String, // 'daily', 'weekly', 'monthly'
  date: Date, // indexed
  metrics: {
    users: {
      total: Number,
      active: Number,
      new: Number
    },
    waste: {
      totalCollected: Number, // kg
      byType: Map, // { recyclable: 1000, organic: 500 }
      perCapita: Number
    },
    recycling: {
      rate: Number, // percentage
      contamination: Number // percentage
    },
    routes: {
      completed: Number,
      avgEfficiency: Number,
      missed: Number
    },
    engagement: {
      chatbotQueries: Number,
      scansPerformed: Number,
      pointsAwarded: Number
    }
  },
  trends: {
    wasteGrowth: Number, // percentage change
    participationRate: Number
  },
  createdAt: Date
}

// ai_predictions.js - ML Model Predictions
{
  _id: ObjectId,
  municipality: ObjectId,
  modelType: String, // 'waste_generation', 'route_optimization', 'demand_forecast'
  modelVersion: String,
  predictionDate: Date,
  timeframe: String, // 'next_week', 'next_month'
  predictions: {
    wasteVolume: Map, // by type
    hotspots: [{
      zone: String,
      location: {
        type: 'Point',
        coordinates: [Number, Number]
      },
      expectedVolume: Number,
      confidence: Number
    }],
    recommendations: [String]
  },
  accuracy: {
    mape: Number, // Mean Absolute Percentage Error
    rmse: Number
  },
  features: Object, // input features used
  createdAt: Date
}
```

### 2.2 Indexes for Performance

```javascript
// Critical indexes for scalability
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "profile.address.coordinates": "2dsphere" });
db.users.createIndex({ municipality: 1, role: 1 });

db.municipalities.createIndex({ slug: 1 }, { unique: true });
db.municipalities.createIndex({ boundary: "2dsphere" });

db.schedules.createIndex({ municipality: 1, zone: 1 });
db.schedules.createIndex({ "pickups.nextPickup": 1 });
db.schedules.createIndex({ location: "2dsphere" });

db.routes.createIndex({ municipality: 1, scheduledDate: 1 });
db.routes.createIndex({ hauler: 1, status: 1 });
db.routes.createIndex({ currentLocation: "2dsphere" });

db.waste_logs.createIndex({ user: 1, createdAt: -1 });
db.waste_logs.createIndex({ municipality: 1, type: 1, createdAt: -1 });
db.waste_logs.createIndex({ location: "2dsphere" });

db.notifications.createIndex({ user: 1, read: 1, createdAt: -1 });
db.notifications.createIndex({ scheduled: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

db.chatbot_conversations.createIndex({ sessionId: 1 });
db.chatbot_conversations.createIndex({ user: 1, createdAt: -1 });

db.analytics.createIndex({ municipality: 1, period: 1, date: -1 });
```

## 3. Backend Implementation

### 3.1 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── aws.js
│   │   └── index.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Municipality.js
│   │   ├── Schedule.js
│   │   ├── Route.js
│   │   ├── WasteLog.js
│   │   ├── Badge.js
│   │   ├── Notification.js
│   │   ├── ChatConversation.js
│   │   ├── Analytics.js
│   │   └── AIPrediction.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── scheduleController.js
│   │   ├── wasteController.js
│   │   ├── mapController.js
│   │   ├── gamificationController.js
│   │   ├── chatbotController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── notificationService.js
│   │   ├── aiChatService.js
│   │   ├── imageRecognitionService.js
│   │   ├── routeOptimizationService.js
│   │   ├── gamificationService.js
│   │   ├── analyticsService.js
│   │   └── predictionService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   ├── validation.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── schedules.js
│   │   ├── waste.js
│   │   ├── maps.js
│   │   ├── gamification.js
│   │   ├── chatbot.js
│   │   ├── analytics.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── workers/
│   │   ├── notificationWorker.js
│   │   ├── analyticsWorker.js
│   │   ├── scheduleWorker.js
│   │   └── mlPredictionWorker.js
│   ├── sockets/
│   │   └── routeTracking.js
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── package.json
└── Dockerfile
```

### 3.2 Key Implementation Files

#### Authentication Middleware (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redis = require('../config/redis');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check cache first
    let user = await redis.get(`user:${decoded.userId}`);
    
    if (!user) {
      user = await User.findById(decoded.userId)
        .select('-password -refreshTokens')
        .populate('municipality', 'name config');
      
      if (!user || !user.active) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }
      
      // Cache for 5 minutes
      await redis.setex(`user:${decoded.userId}`, 300, JSON.stringify(user));
    } else {
      user = JSON.parse(user);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

module.exports = { authMiddleware, roleCheck };
```

#### AI Chatbot Service (services/aiChatService.js)

```javascript
const OpenAI = require('openai');
const ChatConversation = require('../models/ChatConversation');
const Municipality = require('../models/Municipality');
const { createEmbedding, searchVectorDB } = require('../utils/vectorDB');

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
      
      // RAG: Search relevant recycling guidelines
      const messageEmbedding = await createEmbedding(message);
      const relevantDocs = await searchVectorDB(
        messageEmbedding, 
        municipalityId,
        3 // top 3 results
      );

      // Build context-aware prompt
      const systemPrompt = `You are an eco-friendly waste management assistant for ${municipality.name}.
You help users with:
- Recycling guidelines and sorting instructions
- Collection schedules and locations
- Proper disposal methods for various materials
- Sustainability tips and waste reduction strategies

Recycling Rules for ${municipality.name}:
${JSON.stringify(municipality.config.recyclingRules, null, 2)}

Relevant Information:
${relevantDocs.map(doc => doc.content).join('\n\n')}

Always be helpful, accurate, and encourage sustainable practices.`;

      // Add user message
      conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Prepare messages for API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.messages.slice(-10).map(msg => ({ // Last 10 messages
          role: msg.role,
          content: msg.content
        }))
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500
      });

      const assistantMessage = completion.choices[0].message.content;
      const tokensUsed = completion.usage.total_tokens;

      // Add assistant response
      conversation.messages.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
        tokens: tokensUsed
      });

      conversation.metadata.totalTokens = 
        (conversation.metadata.totalTokens || 0) + tokensUsed;
      conversation.metadata.model = 'gpt-4-turbo-preview';

      await conversation.save();

      return {
        message: assistantMessage,
        sessionId,
        tokensUsed
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  async provideFeedback(sessionId, userId, rating, helpful, comment) {
    const conversation = await ChatConversation.findOne({ 
      sessionId, 
      user: userId 
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.feedback = { rating, helpful, comment };
    await conversation.save();

    return { success: true };
  }

  async endSession(sessionId, userId) {
    await ChatConversation.updateOne(
      { sessionId, user: userId },
      { active: false }
    );
  }
}

module.exports = new AIChatService();
```

#### Image Recognition Service (services/imageRecognitionService.js)

```javascript
const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
const sharp = require('sharp');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ImageRecognitionService {
  constructor() {
    this.model = null;
    this.labels = [
      'paper', 'cardboard', 'plastic_bottle', 'plastic_container',
      'glass', 'aluminum_can', 'steel_can', 'e-waste', 'organic',
      'hazardous', 'textile', 'mixed'
    ];
  }

  async loadModel() {
    if (!this.model) {
      // Load pre-trained model (train separately with TensorFlow)
      this.model = await tf.loadLayersModel(
        process.env.TF_MODEL_URL || 'file://./ml_models/waste_classifier/model.json'
      );
    }
  }

  async classifyWithTensorFlow(imageBuffer) {
    await this.loadModel();

    // Preprocess image
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224)
      .toBuffer();

    const tensor = tf.node
      .decodeImage(processedImage)
      .expandDims(0)
      .toFloat()
      .div(255.0);

    // Predict
    const predictions = await this.model.predict(tensor);
    const probabilities = await predictions.data();
    
    // Get top 3 predictions
    const results = this.labels
      .map((label, i) => ({ label, confidence: probabilities[i] }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    tensor.dispose();
    predictions.dispose();

    return results;
  }

  async classifyWithVisionAPI(imageBuffer) {
    // Alternative: Use OpenAI Vision API
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Classify this waste item into one of these categories: ${this.labels.join(', ')}.
Provide:
1. Primary category
2. Confidence (0-1)
3. Recycling instructions
4. Any special handling notes

Format as JSON.`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }],
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  }

  async classifyImage(imageBuffer, method = 'tensorflow') {
    try {
      if (method === 'vision') {
        return await this.classifyWithVisionAPI(imageBuffer);
      } else {
        const results = await this.classifyWithTensorFlow(imageBuffer);
        return {
          category: results[0].label,
          confidence: results[0].confidence,
          alternatives: results.slice(1),
          method: 'tensorflow'
        };
      }
    } catch (error) {
      console.error('Image classification error:', error);
      throw error;
    }
  }

  async getDisposalInstructions(category, municipalityId) {
    const municipality = await Municipality.findById(municipalityId);
    const wasteType = municipality.config.wasteTypes.find(
      wt => wt.type.toLowerCase() === category.toLowerCase()
    );

    return {
      category,
      guidelines: wasteType?.guidelines || 'Please check with your local facility',
      color: wasteType?.color,
      icon: wasteType?.icon,
      facilities: municipality.facilities.filter(
        f => f.acceptedMaterials.includes(category)
      )
    };
  }
}

module.exports = new ImageRecognitionService();
```

#### Gamification Service (services/gamificationService.js)

```javascript
const User = require('../models/User');
const Badge = require('../models/Badge');
const WasteLog = require('../models/WasteLog');
const NotificationService = require('./notificationService');

class GamificationService {
  // Points system
  POINTS = {
    WASTE_LOG: 10,
    CORRECT_SORTING: 20,
    AI_SCAN: 15,
    DROP_OFF: 25,
    CHAT_ENGAGEMENT: 5,
    DAILY_STREAK: 50,
    REFERRAL: 100
  };

  async awardPoints(userId, action, metadata = {}) {
    const points = this.POINTS[action] || 0;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { 
          'gamification.points': points 
        }
      },
      { new: true }
    );

    // Check for level up
    const newLevel = Math.floor(user.gamification.points / 1000) + 1;
    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
      await user.save();
      
      await NotificationService.send(userId, {
        type: 'achievement',
        title: '🎉 Level Up!',
        message: `You've reached level ${newLevel}!`,
        data: { level: newLevel, points }
      });
    }

    // Check for badge achievements
    await this.checkBadges(userId);

    return { points, totalPoints: user.gamification.points, level: user.gamification.level };
  }

  async checkBadges(userId) {
    const user = await User.findById(userId).populate('gamification.badges.badgeId');
    const earnedBadgeIds = user.gamification.badges.map(b => b.badgeId._id.toString());
    
    const availableBadges = await Badge.find({ 
      active: true,
      _id: { $nin: earnedBadgeIds }
    });

    for (const badge of availableBadges) {
      const earned = await this.evaluateBadgeCriteria(userId, badge);
      
      if (earned) {
        user.gamification.badges.push({
          badgeId: badge._id,
          earnedAt: new Date()
        });
        
        user.gamification.points += badge.points;
        
        await user.save();
        
        await NotificationService.send(userId, {
          type: 'achievement',
          title: '🏆 New Badge Earned!',
          message: `You've earned the "${badge.name}" badge!`,
          data: { badge: badge.name, points: badge.points }
        });
      }
    }
  }

  async evaluateBadgeCriteria(userId, badge) {
    const { action, threshold, timeframe } = badge.criteria;
    
    let query = { user: userId };
    
    // Apply timeframe filter
    if (timeframe !== 'all_time') {
      const now = new Date();
      let startDate;
      
      if (timeframe === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeframe === 'weekly') {
        startDate = new Date(now.setDate(now.getDate() - 7));
      }
      
      query.createdAt = { $gte: startDate };
    }

    switch (action) {
      case 'recycle_count':
        const count = await WasteLog.countDocuments(query);
        return count >= threshold;
      
      case 'weight_recycled':
        const result = await WasteLog.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: '$weight' } } }
        ]);
        return result[0]?.total >= threshold;
      
      case 'streak_days':
        const user = await User.findById(userId);
        return user.gamification.streak.current >= threshold;
      
      default:
        return false;
    }
  }

  async updateStreak(userId) {
    const user = await User.findById(userId);
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActivity = new Date(user.gamification.streak.lastActivity).setHours(0, 0, 0, 0);
    const daysDiff = (today - lastActivity) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
      // Continue streak
      user.gamification.streak.current += 1;
      if (user.gamification.streak.current > user.gamification.streak.longest) {
        user.gamification.streak.longest = user.gamification.streak.current;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      user.gamification.streak.current = 1;
    }

    user.gamification.streak.lastActivity = new Date();
    await user.save();

    // Award streak bonus
    if (user.gamification.streak.current % 7 === 0) {
      await this.awardPoints(userId, 'DAILY_STREAK');
    }
  }

  async getLeaderboard(municipalityId, period = 'all_time', limit = 50) {
    const match = { municipality: municipalityId, active: true };
    
    if (period === 'monthly') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      // Aggregate points from waste logs this month
      const monthlyPoints = await WasteLog.aggregate([
        { 
          $match: { 
            municipality: municipalityId,
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: '$user',
            points: { $sum: '$points' }
          }
        },
        { $sort: { points: -1 } },
        { $limit: limit }
      ]);
      
      const userIds = monthlyPoints.map(p => p._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select('profile.firstName profile.lastName profile.avatar gamification');
      
      return monthlyPoints.map((p, index) => {
        const user = users.find(u => u._id.toString() === p._id.toString());
        return {
          rank: index + 1,
          userId: p._id,
          name: `${user.profile.firstName} ${user.profile.lastName}`,
          avatar: user.profile.avatar,
          points: p.points,
          level: user.gamification.level,
          badges: user.gamification.badges.length
        };
      });
    } else {
      // All-time leaderboard
      const users = await User.find(match)
        .select('profile.firstName profile.lastName profile.avatar gamification')
        .sort({ 'gamification.points': -1 })
        .limit(limit);
      
      return users.map((user, index) => ({
        rank: index + 1,
        userId: user._id,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        avatar: user.profile.avatar,
        points: user.gamification.points,
        level: user.gamification.level,
        badges: user.gamification.badges.length
      }));
    }
  }
}

module.exports = new GamificationService();
```

#### Route Optimization Service (services/routeOptimizationService.js)

```javascript
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const axios = require('axios');

class RouteOptimizationService {
  async optimizeRoute(routeId) {
    const route = await Route.findById(routeId).populate('waypoints');
    
    if (!route || route.waypoints.length < 2) {
      throw new Error('Invalid route for optimization');
    }

    // Extract coordinates
    const waypoints = route.waypoints.map(wp => ({
      id: wp._id,
      coordinates: wp.location.coordinates,
      address: wp.address
    }));

    // Use Mapbox Optimization API
    const optimized = await this.callMapboxOptimization(waypoints);
    
    // Reorder waypoints based on optimization
    route.waypoints = optimized.waypoints.map(wp => {
      const original = route.waypoints.find(
        w => w._id.toString() === wp.waypoint_index.toString()
      );
      return {
        ...original.toObject(),
        estimatedTime: new Date(Date.now() + wp.estimated_arrival * 1000)
      };
    });

    route.efficiency.plannedDistance = optimized.distance / 1000; // meters to km
    await route.save();

    return route;
  }

  async callMapboxOptimization(waypoints) {
    const coordinates = waypoints.map(wp => wp.coordinates.join(',')).join(';');
    
    const response = await axios.get(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}`,
      {
        params: {
          access_token: process.env.MAPBOX_ACCESS_TOKEN,
          overview: 'full',
          steps: true,
          geometries: 'geojson'
        }
      }
    );

    return {
      distance: response.data.trips[0].distance,
      duration: response.data.trips[0].duration,
      waypoints: response.data.waypoints
    };
  }

  async predictDemand(municipalityId, date) {
    // Call Python ML service for demand prediction
    try {
      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict/demand`,
        {
          municipality_id: municipalityId,
          date: date,
          features: await this.extractFeatures(municipalityId)
        },
        {
          headers: { 'X-API-Key': process.env.ML_SERVICE_API_KEY }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Demand prediction error:', error);
      return null;
    }
  }

  async extractFeatures(municipalityId) {
    // Extract historical features for ML model
    const WasteLog = require('../models/WasteLog');
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyStats = await WasteLog.aggregate([
      {
        $match: {
          municipality: municipalityId,
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalWeight: { $sum: '$weight' },
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      avg_daily_weight: weeklyStats.reduce((sum, s) => sum + s.totalWeight, 0) / 7,
      avg_daily_count: weeklyStats.reduce((sum, s) => sum + s.count, 0) / 7,
      trend: this.calculateTrend(weeklyStats)
    };
  }

  calculateTrend(data) {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d.totalWeight, 0) / 3;
    const older = data.slice(0, 3).reduce((sum, d) => sum + d.totalWeight, 0) / 3;
    return ((recent - older) / older) * 100;
  }
}

module.exports = new RouteOptimizationService();
```

#### Notification Service (services/notificationService.js)

```javascript
const Notification = require('../models/Notification');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class NotificationService {
  async send(userId, payload) {
    const notification = new Notification({
      user: userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      data: payload.data,
      scheduled: payload.scheduledAt || new Date(),
      priority: payload.priority || 'medium'
    });

    await notification.save();

    // Queue for immediate sending if not scheduled
    if (!payload.scheduledAt) {
      await this.process(notification._id);
    }

    return notification;
  }

  async process(notificationId) {
    const notification = await Notification.findById(notificationId)
      .populate('user', 'preferences profile.email profile.phone');

    if (!notification) return;

    const user = notification.user;
    const promises = [];

    // Push notification
    if (user.preferences.notifications.push) {
      promises.push(this.sendPush(user, notification));
    }

    // Email notification
    if (user.preferences.notifications.email) {
      promises.push(this.sendEmail(user, notification));
    }

    // SMS notification (high priority only)
    if (user.preferences.notifications.sms && notification.priority === 'urgent') {
      promises.push(this.sendSMS(user, notification));
    }

    await Promise.allSettled(promises);
    await notification.save();
  }

  async sendPush(user, notification) {
    try {
      // Get FCM token from user device registration (stored separately)
      const DeviceToken = require('../models/DeviceToken');
      const tokens = await DeviceToken.find({ 
        user: user._id, 
        active: true 
      }).select('token');

      if (tokens.length === 0) return;

      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: notification.data || {},
        tokens: tokens.map(t => t.token)
      };

      const response = await admin.messaging().sendMulticast(message);
      
      notification.channels.push = {
        sent: true,
        sentAt: new Date()
      };

      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx].token);
          }
        });
        await DeviceToken.updateMany(
          { token: { $in: failedTokens } },
          { active: false }
        );
      }
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  async sendEmail(user, notification) {
    try {
      const msg = {
        to: user.profile.email,
        from: process.env.FROM_EMAIL,
        subject: notification.title,
        text: notification.message,
        html: this.renderEmailTemplate(notification)
      };

      await sgMail.send(msg);
      
      notification.channels.email = {
        sent: true,
        sentAt: new Date()
      };
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  async sendSMS(user, notification) {
    try {
      await twilioClient.messages.create({
        body: `${notification.title}: ${notification.message}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.profile.phone
      });

      notification.channels.sms = {
        sent: true,
        sentAt: new Date()
      };
    } catch (error) {
      console.error('SMS notification error:', error);
    }
  }

  renderEmailTemplate(notification) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
          .header { color: #2e7d32; font-size: 24px; margin-bottom: 20px; }
          .message { color: #333; line-height: 1.6; }
          .footer { margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${notification.title}</div>
          <div class="message">${notification.message}</div>
          <div class="footer">
            You're receiving this because of your notification preferences.
            <a href="${process.env.APP_URL}/settings">Update preferences</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async schedulePickupReminders(municipalityId) {
    const Schedule = require('../models/Schedule');
    const User = require('../models/User');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Find all pickups scheduled for tomorrow
    const schedules = await Schedule.find({
      municipality: municipalityId,
      'pickups.nextPickup': {
        $gte: tomorrow,
        $lte: tomorrowEnd
      }
    }).populate('subscribers');

    for (const schedule of schedules) {
      const pickup = schedule.pickups.find(
        p => p.nextPickup >= tomorrow && p.nextPickup <= tomorrowEnd
      );

      if (!pickup) continue;

      for (const userId of schedule.subscribers) {
        const user = await User.findById(userId);
        const reminderTime = new Date(pickup.nextPickup);
        reminderTime.setHours(
          reminderTime.getHours() - (user.preferences.notifications.reminderHours || 12)
        );

        await this.send(userId, {
          type: 'pickup_reminder',
          title: `♻️ Pickup Tomorrow`,
          message: `${pickup.wasteType} collection scheduled for ${pickup.time}`,
          data: {
            wasteType: pickup.wasteType,
            time: pickup.time,
            scheduleId: schedule._id
          },
          scheduledAt: reminderTime,
          priority: 'high'
        });
      }
    }
  }
}

module.exports = new NotificationService();
```

## 4. Frontend Implementation

### 4.1 React Web App Structure

```
frontend-web/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── HaulerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── education/
│   │   │   ├── RecyclingGuide.jsx
│   │   │   ├── WasteTips.jsx
│   │   │   └── VideoTutorials.jsx
│   │   ├── chatbot/
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatInput.jsx
│   │   ├── schedule/
│   │   │   ├── PickupCalendar.jsx
│   │   │   ├── ScheduleList.jsx
│   │   │   └── ReminderSettings.jsx
│   │   ├── waste/
│   │   │   ├── WasteLogger.jsx
│   │   │   ├── ImageScanner.jsx
│   │   │   ├── WasteHistory.jsx
│   │   │   └── DisposalInstructions.jsx
│   │   ├── maps/
│   │   │   ├── FacilityMap.jsx
│   │   │   ├── RouteTracker.jsx
│   │   │   └── LocationSearch.jsx
│   │   ├── gamification/
│   │   │   ├── PointsDisplay.jsx
│   │   │   ├── BadgeGallery.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── StreakTracker.jsx
│   │   └── analytics/
│   │       ├── WasteChart.jsx
│   │       ├── TrendAnalysis.jsx
│   │       └── ImpactMetrics.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Education.jsx
│   │   ├── Schedule.jsx
│   │   ├── Map.jsx
│   │   ├── Profile.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Analytics.jsx (admin)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useNotifications.js
│   │   ├── useGeolocation.js
│   │   └── useWebSocket.js
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── scheduleSlice.js
│   │   │   ├── wasteSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── gamificationSlice.js
│   │   ├── api/
│   │   │   └── apiSlice.js (RTK Query)
│   │   └── store.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
├── public/
├── package.json
└── vite.config.js
```

### 4.2 Key React Components

#### Chat Widget Component (components/chatbot/ChatWidget.jsx)

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { sendMessage, createSession } from '../../store/slices/chatSlice';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const dispatch = useDispatch();
  const { messages, sessionId, loading } = useSelector(state => state.chat);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      dispatch(createSession());
    }
  }, [isOpen, sessionId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    setIsTyping(true);

    await dispatch(sendMessage({ message, sessionId }));
    setIsTyping(false);
  };

  const handleFeedback = (messageId, helpful) => {
    // Send feedback to backend
    fetch(`/api/chatbot/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, helpful, sessionId })
    });
  };

  if (!isOpen) {
    return (
      <button 
        className="chat-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        💬
      </button>
    );
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>♻️ Eco Assistant</h3>
        <button onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`message ${msg.role}`}
          >
            <div className="message-content">{msg.content}</div>
            {msg.role === 'assistant' && (
              <div className="message-feedback">
                <button onClick={() => handleFeedback(msg.id, true)}>
                  <ThumbsUp size={14} />
                </button>
                <button onClick={() => handleFeedback(msg.id, false)}>
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about recycling..."
          disabled={loading}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
```

#### Image Scanner Component (components/waste/ImageScanner.jsx)

```jsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { classifyImage, logWaste } from '../../store/slices/wasteSlice';

const ImageScanner = ({ onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClassify = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await dispatch(classifyImage(formData)).unwrap();
      setResult(response);
    } catch (error) {
      alert('Classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    if (!result) return;

    try {
      await dispatch(logWaste({
        type: result.category,
        image: preview,
        classification: {
          method: 'ai_scan',
          confidence: result.confidence
        }
      })).unwrap();

      onSuccess?.();
    } catch (error) {
      alert('Failed to log waste. Please try again.');
    }
  };

  return (
    <div className="scanner-modal">
      <div className="scanner-content">
        <div className="scanner-header">
          <h2>Scan Waste Item</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {!preview ? (
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              style={{ display: 'none' }}
            />
            <button 
              className="capture-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={48} />
              <span>Take Photo</span>
            </button>
            <button 
              className="upload-btn"
              onClick={() => {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current?.click();
              }}
            >
              <Upload size={24} />
              <span>Upload Image</span>
            </button>
          </div>
        ) : (
          <>
            <div className="preview-area">
              <img src={preview} alt="Preview" />
            </div>

            {result && (
              <div className="result-area">
                <h3>Classification Result</h3>
                <div className="result-category">
                  <span className="category">{result.category}</span>
                  <span className="confidence">
                    {(result.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <div className="disposal-info">
                  <h4>Disposal Instructions:</h4>
                  <p>{result.guidelines}</p>
                </div>
              </div>
            )}

            <div className="scanner-actions">
              {!result ? (
                <>
                  <button onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}>
                    Retake
                  </button>
                  <button 
                    onClick={handleClassify}
                    disabled={loading}
                    className="primary"
                  >
                    {loading ? 'Analyzing...' : 'Classify'}
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLog}
                  className="primary"
                >
                  Log & Earn Points
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageScanner;
```

#### Route Tracker Component (components/maps/RouteTracker.jsx)

```jsx
import React, { useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import { useWebSocket } from '../../hooks/useWebSocket';
import 'mapbox-gl/dist/mapbox-gl.css';

const RouteTracker = ({ routeId, userLocation }) => {
  const [viewport, setViewport] = useState({
    latitude: userLocation?.lat || 0,
    longitude: userLocation?.lng || 0,
    zoom: 13
  });
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [eta, setEta] = useState(null);

  // WebSocket connection for real-time tracking
  const socket = useWebSocket();

  useEffect(() => {
    if (!socket || !routeId) return;

    socket.emit('track_route', routeId);

    socket.on('vehicle_location', (data) => {
      setVehicleLocation({
        lat: data.location.coordinates[1],
        lng: data.location.coordinates[0]
      });
      setEta(data.eta);
    });

    socket.on('route_update', (data) => {
      setRoute(data.route);
    });

    return () => {
      socket.off('vehicle_location');
      socket.off('route_update');
    };
  }, [socket, routeId]);

  const routeLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#2e7d32',
      'line-width': 4
    }
  };

  return (
    <div className="route-tracker">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {/* User location */}
        {userLocation && (
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
          >
            <div className="user-marker">📍</div>
          </Marker>
        )}

        {/* Vehicle location */}
        {vehicleLocation && (
          <Marker
            latitude={vehicleLocation.lat}
            longitude={vehicleLocation.lng}
          >
            <div className="vehicle-marker">🚛</div>
          </Marker>
        )}

        {/* Route path */}
        {route && (
          <Source type="geojson" data={route}>
            <Layer {...routeLayer} />
          </Source>
        )}
      </Map>

      {eta && (
        <div className="eta-banner">
          <span>Estimated arrival: {eta} minutes</span>
        </div>
      )}
    </div>
  );
};

export default RouteTracker;
```

### 4.3 React Native Mobile App Structure

```
frontend-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── main/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ScheduleScreen.tsx
│   │   │   ├── ScanScreen.tsx
│   │   │   ├── MapScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── LeaderboardScreen.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       └── AnalyticsScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── chat/
│   │   ├── gamification/
│   │   └── waste/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── hooks/
│   ├── store/
│   ├── services/
│   │   ├── api.ts
│   │   ├── notifications.ts
│   │   ├── geolocation.ts
│   │   └── camera.ts
│   ├── utils/
│   └── App.tsx
├── android/
├── ios/
└── package.json
```

#### Camera Scanner Screen (screens/main/ScanScreen.tsx)

```typescript
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { classifyImage, logWaste } from '../../store/slices/wasteSlice';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true
    });

    setCapturedImage(photo);
    await classifyWaste(photo);
  };

  const classifyWaste = async (photo) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'waste.jpg'
      });

      const response = await dispatch(classifyImage(formData)).unwrap();
      setResult(response);
    } catch (error) {
      alert('Classification failed');
    } finally {
      setLoading(false);
    }
  };

  const logAndEarnPoints = async () => {
    try {
      await dispatch(logWaste({
        type: result.category,
        image: capturedImage.uri,
        classification: {
          method: 'ai_scan',
          confidence: result.confidence
        }
      })).unwrap();

      navigation.navigate('Home', { 
        message: `+${result.points} points earned!` 
      });
    } catch (error) {
      alert('Failed to log waste');
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: capturedImage.uri }} 
          style={styles.preview} 
        />

        {loading && <ActivityIndicator size="large" color="#2e7d32" />}

        {result && (
          <View style={styles.resultCard}>
            <Text variant="headlineSmall">{result.category}</Text>
            <Text variant="bodyMedium">
              Confidence: {(result.confidence * 100).toFixed(0)}%
            </Text>
            <Text style={styles.guidelines}>{result.guidelines}</Text>
            
            <Button 
              mode="contained" 
              onPress={logAndEarnPoints}
              style={styles.logButton}
            >
              Log & Earn {result.points} Points
            </Button>
          </View>
        )}

        <Button 
          mode="outlined" 
          onPress={() => {
            setCapturedImage(null);
            setResult(null);
          }}
        >
          Retake
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type} 
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2e7d32'
  },
  preview: {
    width: '100%',
    height: '50%'
  },
  resultCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16
  },
  guidelines: {
    marginTop: 12,
    marginBottom: 16
  },
  logButton: {
    marginTop: 8
  }
});

export default ScanScreen;
```

## 5. AI/ML Services

### 5.1 Python Forecasting Microservice

```python
# ml_service/main.py
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.ensemble import RandomForestRegressor
import joblib
from datetime import datetime, timedelta
import os

app = FastAPI(title="Waste Management ML Service")

# Authentication
API_KEY = os.getenv("ML_SERVICE_API_KEY")

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key

# Models cache
models_cache = {}

class PredictionRequest(BaseModel):
    municipality_id: str
    date: str
    features: Dict[str, float]

class DemandPrediction(BaseModel):
    date: str
    predicted_volume: float
    confidence_interval: tuple
    hotspots: List[Dict]

@app.post("/predict/demand", response_model=DemandPrediction)
async def predict_demand(
    request: PredictionRequest,
    api_key: str = Depends(verify_api_key)
):
    """Predict waste generation demand for a given date"""
    try:
        # Load or train model for municipality
        model = get_or_train_model(request.municipality_id)
        
        # Prepare features
        target_date = pd.to_datetime(request.date)
        features_df = pd.DataFrame([{
            'ds': target_date,
            'day_of_week': target_date.dayofweek,
            'month': target_date.month,
            'is_holiday': check_holiday(target_date),
            'avg_daily_weight': request.features['avg_daily_weight'],
            'avg_daily_count': request.features['avg_daily_count'],
            'trend': request.features['trend']
        }])
        
        # Make prediction
        forecast = model.predict(features_df)
        prediction = forecast['yhat'].iloc[0]
        lower_bound = forecast['yhat_lower'].iloc[0]
        upper_bound = forecast['yhat_upper'].iloc[0]
        
        # Identify hotspots (simplified)
        hotspots = identify_hotspots(
            request.municipality_id, 
            prediction
        )
        
        return DemandPrediction(
            date=request.date,
            predicted_volume=float(prediction),
            confidence_interval=(float(lower_bound), float(upper_bound)),
            hotspots=hotspots
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_or_train_model(municipality_id: str):
    """Get cached model or train new one"""
    if municipality_id in models_cache:
        return models_cache[municipality_id]
    
    # Fetch historical data from MongoDB
    historical_data = fetch_historical_data(municipality_id)
    
    # Train Prophet model
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )
    model.add_regressor('avg_daily_weight')
    model.add_regressor('trend')
    model.fit(historical_data)
    
    models_cache[municipality_id] = model
    return model

def fetch_historical_data(municipality_id: str) -> pd.DataFrame:
    """Fetch historical waste data from MongoDB"""
    from pymongo import MongoClient
    
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client.waste_management
    
    # Aggregate daily waste volumes
    pipeline = [
        {
            "$match": {
                "municipality": municipality_id,
                "createdAt": {
                    "$gte": datetime.now() - timedelta(days=365)
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$createdAt"
                    }
                },
                "total_weight": {"$sum": "$weight"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    results = list(db.waste_logs.aggregate(pipeline))
    
    df = pd.DataFrame([
        {
            'ds': pd.to_datetime(r['_id']),
            'y': r['total_weight'],
            'avg_daily_weight': r['total_weight'],
            'trend': 0  # Calculate actual trend
        }
        for r in results
    ])
    
    return df

def identify_hotspots(municipality_id: str, predicted_volume: float):
    """Identify geographical hotspots with high waste generation"""
    from pymongo import MongoClient
    
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client.waste_management
    
    # Spatial aggregation
    pipeline = [
        {
            "$match": {
                "municipality": municipality_id,
                "createdAt": {
                    "$gte": datetime.now() - timedelta(days=7)
                }
            }
        },
        {
            "$group": {
                "_id": "$location",
                "volume": {"$sum": "$weight"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"volume": -1}},
        {"$limit": 5}
    ]
    
    results = list(db.waste_logs.aggregate(pipeline))
    
    hotspots = [
        {
            "location": {
                "lat": r['_id']['coordinates'][1],
                "lng": r['_id']['coordinates'][0]
            },
            "expectedVolume": float(r['volume']),
            "confidence": 0.85  # Simplified
        }
        for r in results if r['_id']
    ]
    
    return hotspots

def check_holiday(date: datetime) -> bool:
    """Check if date is a holiday (simplified)"""
    # Integrate with holidays library or API
    import holidays
    us_holidays = holidays.US()
    return date in us_holidays

@app.post("/train/model/{municipality_id}")
async def train_model(
    municipality_id: str,
    api_key: str = Depends(verify_api_key)
):
    """Train or retrain model for a municipality"""
    try:
        model = get_or_train_model(municipality_id)
        
        # Save model
        model_path = f"models/{municipality_id}_prophet.pkl"
        joblib.dump(model, model_path)
        
        return {
            "status": "success",
            "municipality_id": municipality_id,
            "model_path": model_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

### 5.2 TensorFlow Model Training Script

```python
# ml_service/train_image_classifier.py
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os

# Categories
CATEGORIES = [
    'paper', 'cardboard', 'plastic_bottle', 'plastic_container',
    'glass', 'aluminum_can', 'steel_can', 'e-waste', 'organic',
    'hazardous', 'textile', 'mixed'
]

def create_model(num_classes=12):
    """Create CNN model for waste classification"""
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def prepare_data(data_dir):
    """Prepare training data with augmentation"""
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )
    
    val_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )
    
    return train_generator, val_generator

def train_model(data_dir, epochs=50):
    """Train the waste classification model"""
    train_gen, val_gen = prepare_data(data_dir)
    
    model = create_model(num_classes=len(CATEGORIES))
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            patience=5,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            factor=0.2,
            patience=3
        ),
        tf.keras.callbacks.ModelCheckpoint(
            'models/waste_classifier_best.h5',
            save_best_only=True
        )
    ]
    
    # Train
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=callbacks
    )
    
    # Save final model
    model.save('models/waste_classifier_final.h5')
    
    # Convert to TensorFlow.js format
    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, 'models/waste_classifier')
    
    print("Model training complete!")
    return model, history

if __name__ == "__main__":
    # Train model with your dataset
    # Dataset structure: data_dir/category_name/images
    train_model('data/waste_images', epochs=50)
```

## 6. Worker Jobs & Cron Tasks

```javascript
// workers/scheduleWorker.js
const Bull = require('bull');
const NotificationService = require('../services/notificationService');
const Schedule = require('../models/Schedule');
const Municipality = require('../models/Municipality');

const scheduleQueue = new Bull('schedule-jobs', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Process jobs
scheduleQueue.process('send-reminders', async (job) => {
  const { municipalityId } = job.data;
  
  console.log(`Processing reminders for municipality: ${municipalityId}`);
  await NotificationService.schedulePickupReminders(municipalityId);
  
  return { success: true };
});

scheduleQueue.process('update-schedules', async (job) => {
  // Update next pickup dates for all schedules
  const schedules = await Schedule.find({});
  
  for (const schedule of schedules) {
    for (const pickup of schedule.pickups) {
      if (pickup.nextPickup < new Date()) {
        // Calculate next pickup date
        pickup.nextPickup = calculateNextPickup(
          pickup.dayOfWeek,
          pickup.frequency
        );
      }
    }
    await schedule.save();
  }
  
  return { updated: schedules.length };
});

function calculateNextPickup(dayOfWeek, frequency) {
  const today = new Date();
  const currentDay = today.getDay();
  let daysUntilNext = (dayOfWeek - currentDay + 7) % 7;
  
  if (daysUntilNext === 0) {
    daysUntilNext = frequency === 'weekly' ? 7 : 14;
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  return nextDate;
}

// Schedule recurring jobs
async function scheduleRecurringJobs() {
  const municipalities = await Municipality.find({ active: true });
  
  for (const muni of municipalities) {
    // Daily at 6 AM: Send pickup reminders
    scheduleQueue.add(
      'send-reminders',
      { municipalityId: muni._id },
      {
        repeat: { cron: '0 6 * * *' },
        jobId: `reminders-${muni._id}`
      }
    );
  }
  
  // Daily at midnight: Update schedules
  scheduleQueue.add(
    'update-schedules',
    {},
    {
      repeat: { cron: '0 0 * * *' },
      jobId: 'update-schedules-daily'
    }
  );
}

module.exports = { scheduleQueue, scheduleRecurringJobs };
```

## 7. Deployment & Scaling

### 7.1 Docker Configuration

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/waste_management?authSource=admin
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongodb
      - redis

  ml-service:
    build: ./ml_service
    ports:
      - "8001:8001"
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/waste_management?authSource=admin
      - ML_SERVICE_API_KEY=${ML_SERVICE_API_KEY}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend-web
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
  redis_data:
```

### 7.2 Kubernetes Configuration (Production)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: waste-mgmt-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: waste-mgmt-backend
  template:
    metadata:
      labels:
        app: waste-mgmt-backend
    spec:
      containers:
      - name: backend
        image: your-registry/waste-mgmt-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        - name: REDIS_URL
          value: redis://redis-service:6379
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: waste-mgmt-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: waste-mgmt-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 8. Testing Strategy

### 8.1 Backend Testing

```javascript
// tests/integration/waste.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const WasteLog = require('../../src/models/WasteLog');
const { setupTestDB, teardownTestDB } = require('../helpers/db');

describe('Waste Logging API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await setupTestDB();
    
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'citizen',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    });

    // Get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = response.body.token;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/waste/log', () => {
    it('should log waste and award points', async () => {
      const response = await request(app)
        .post('/api/waste/log')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'recyclable',
          category: 'plastic_bottle',
          weight: 0.5
        });

      expect(response.status).toBe(201);
      expect(response.body.points).toBeGreaterThan(0);
      expect(response.body.log).toHaveProperty('_id');

      // Verify database
      const log = await WasteLog.findById(response.body.log._id);
      expect(log).toBeTruthy();
      expect(log.user.toString()).toBe(testUser._id.toString());
    });

    it('should reject invalid waste type', async () => {
      const response = await request(app)
        .post('/api/waste/log')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'invalid_type',
          category: 'test',
          weight: 1
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/waste/history', () => {
    it('should return user waste history', async () => {
      const response = await request(app)
        .get('/api/waste/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.logs)).toBe(true);
    });
  });
});
```

### 8.2 Frontend Testing

```jsx
// tests/components/ChatWidget.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChatWidget from '../../src/components/chatbot/ChatWidget';
import chatReducer from '../../src/store/slices/chatSlice';

const mockStore = configureStore({
  reducer: {
    chat: chatReducer
  }
});

describe('ChatWidget Component', () => {
  it('renders chat button when closed', () => {
    render(
      <Provider store={mockStore}>
        <ChatWidget />
      </Provider>
    );

    expect(screen.getByLabelText('Open chat')).toBeInTheDocument();
  });

  it('opens chat window on button click', () => {
    render(
      <Provider store={mockStore}>
        <ChatWidget />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Open chat'));
    expect(screen.getByText('♻️ Eco Assistant')).toBeInTheDocument();
  });

  it('sends message and receives response', async () => {
    render(
      <Provider store={mockStore}>
        <ChatWidget />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Open chat'));
    
    const input = screen.getByPlaceholderText('Ask about recycling...');
    fireEvent.change(input, { target: { value: 'How do I recycle plastic?' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/How do I recycle plastic?/i)).toBeInTheDocument();
    });
  });
});
```

## 9. Monitoring & Analytics

### 9.1 Application Monitoring

```javascript
// src/config/monitoring.js
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [
    new ProfilingIntegration()
  ]
});

// Custom metrics tracking
const metrics = {
  trackAPICall: (endpoint, duration, statusCode) => {
    // Send to DataDog/Prometheus
    console.log(`API: ${endpoint} | ${duration}ms | ${statusCode}`);
  },
  
  trackChatbotInteraction: (userId, tokensUsed) => {
    // Track AI usage for cost monitoring
    console.log(`Chatbot: User ${userId} | Tokens: ${tokensUsed}`);
  },
  
  trackWasteLog: (municipalityId, type, weight) => {
    // Track waste metrics
    console.log(`Waste: ${municipalityId} | ${type} | ${weight}kg`);
  }
};

module.exports = { Sentry, metrics };
```

### 9.2 Analytics Dashboard Service

```javascript
// services/analyticsService.js
const Analytics = require('../models/Analytics');
const WasteLog = require('../models/WasteLog');
const User = require('../models/User');
const Route = require('../models/Route');

class AnalyticsService {
  async generateDailyReport(municipalityId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // User metrics
    const totalUsers = await User.countDocuments({
      municipality: municipalityId,
      active: true
    });
    
    const activeUsers = await WasteLog.distinct('user', {
      municipality: municipalityId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const newUsers = await User.countDocuments({
      municipality: municipalityId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Waste metrics
    const wasteStats = await WasteLog.aggregate([
      {
        $match: {
          municipality: municipalityId,
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$type',
          totalWeight: { $sum: '$weight' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalWaste = wasteStats.reduce((sum, s) => sum + s.totalWeight, 0);
    const wasteByType = {};
    wasteStats.forEach(s => {
      wasteByType[s._id] = s.totalWeight;
    });

    // Route efficiency
    const routes = await Route.find({
      municipality: municipalityId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    });

    const avgEfficiency = routes.length > 0
      ? routes.reduce((sum, r) => {
          const efficiency = r.efficiency.plannedDistance > 0
            ? (r.efficiency.plannedDistance / r.efficiency.actualDistance) * 100
            : 100;
          return sum + efficiency;
        }, 0) / routes.length
      : 0;

    // Engagement metrics
    const ChatConversation = require('../models/ChatConversation');
    const chatbotQueries = await ChatConversation.countDocuments({
      'context.municipality': municipalityId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const scansPerformed = await WasteLog.countDocuments({
      municipality: municipalityId,
      'classification.method': 'ai_scan',
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const pointsAwarded = await WasteLog.aggregate([
      {
        $match: {
          municipality: municipalityId,
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$points' }
        }
      }
    ]);

    // Calculate recycling rate
    const recyclableWaste = wasteByType['recyclable'] || 0;
    const recyclingRate = totalWaste > 0 
      ? (recyclableWaste / totalWaste) * 100 
      : 0;

    // Create analytics record
    const analytics = new Analytics({
      municipality: municipalityId,
      period: 'daily',
      date: startOfDay,
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers.length,
          new: newUsers
        },
        waste: {
          totalCollected: totalWaste,
          byType: wasteByType,
          perCapita: totalUsers > 0 ? totalWaste / totalUsers : 0
        },
        recycling: {
          rate: recyclingRate,
          contamination: 0 // Would need inspection data
        },
        routes: {
          completed: routes.length,
          avgEfficiency,
          missed: 0 // Track separately
        },
        engagement: {
          chatbotQueries,
          scansPerformed,
          pointsAwarded: pointsAwarded[0]?.total || 0
        }
      },
      trends: {
        wasteGrowth: await this.calculateGrowth(municipalityId, 'waste', date),
        participationRate: (activeUsers.length / totalUsers) * 100
      }
    });

    await analytics.save();
    return analytics;
  }

  async calculateGrowth(municipalityId, metric, currentDate) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 7);

    const current = await Analytics.findOne({
      municipality: municipalityId,
      period: 'daily',
      date: currentDate
    });

    const previous = await Analytics.findOne({
      municipality: municipalityId,
      period: 'daily',
      date: previousDate
    });

    if (!current || !previous) return 0;

    const currentValue = current.metrics.waste.totalCollected;
    const previousValue = previous.metrics.waste.totalCollected;

    return previousValue > 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;
  }

  async getDashboardData(municipalityId, timeframe = '30d') {
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await Analytics.find({
      municipality: municipalityId,
      period: 'daily',
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Prepare chart data
    const chartData = {
      wasteCollection: analytics.map(a => ({
        date: a.date,
        total: a.metrics.waste.totalCollected,
        recyclable: a.metrics.waste.byType?.recyclable || 0,
        organic: a.metrics.waste.byType?.organic || 0
      })),
      
      userEngagement: analytics.map(a => ({
        date: a.date,
        active: a.metrics.users.active,
        new: a.metrics.users.new
      })),
      
      recyclingRate: analytics.map(a => ({
        date: a.date,
        rate: a.metrics.recycling.rate
      }))
    };

    // Calculate summary metrics
    const totalWaste = analytics.reduce(
      (sum, a) => sum + a.metrics.waste.totalCollected, 
      0
    );
    
    const avgRecyclingRate = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.metrics.recycling.rate, 0) / analytics.length
      : 0;

    const totalPoints = analytics.reduce(
      (sum, a) => sum + a.metrics.engagement.pointsAwarded,
      0
    );

    return {
      summary: {
        totalWaste,
        avgRecyclingRate,
        totalPoints,
        activeUsers: analytics[analytics.length - 1]?.metrics.users.active || 0
      },
      charts: chartData,
      trends: {
        wasteGrowth: analytics[analytics.length - 1]?.trends.wasteGrowth || 0,
        participation: analytics[analytics.length - 1]?.trends.participationRate || 0
      }
    };
  }

  async exportReport(municipalityId, startDate, endDate, format = 'csv') {
    const analytics = await Analytics.find({
      municipality: municipalityId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    if (format === 'csv') {
      return this.generateCSV(analytics);
    } else if (format === 'pdf') {
      return this.generatePDF(analytics);
    }
  }

  generateCSV(analytics) {
    const csv = ['Date,Total Waste (kg),Recycling Rate (%),Active Users,Points Awarded'];
    
    analytics.forEach(a => {
      csv.push([
        a.date.toISOString().split('T')[0],
        a.metrics.waste.totalCollected,
        a.metrics.recycling.rate.toFixed(2),
        a.metrics.users.active,
        a.metrics.engagement.pointsAwarded
      ].join(','));
    });

    return csv.join('\n');
  }

  async generatePDF(analytics) {
    // Use a library like pdfkit or puppeteer
    // Implementation depends on requirements
    return Buffer.from('PDF content');
  }
}

module.exports = new AnalyticsService();
```

## 10. Security Implementation

### 10.1 Security Middleware

```javascript
// middleware/security.js
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        connectSrc: ["'self'", "https://api.mapbox.com", "wss:"]
      }
    }
  }));

  // CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  // Prevent NoSQL injection
  app.use(mongoSanitize());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent HTTP parameter pollution
  app.use(hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  }));

  // Request size limiting
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

module.exports = securityMiddleware;
```

### 10.2 Rate Limiting

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

// General API limiter
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Auth limiter (stricter)
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later'
});

// AI endpoint limiter (cost control)
const aiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:ai:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 AI requests per hour per user
  keyGenerator: (req) => req.user?._id || req.ip,
  message: 'AI request limit reached, please try again later'
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter
};
```

## 11. Internationalization (i18n)

### 11.1 Backend i18n Setup

```javascript
// config/i18n.js
const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es', 'fr', 'sw', 'ar'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  api: {
    __: 'translate',
    __n: 'translateN'
  }
});

module.exports = i18n;
```

```json
// locales/en.json
{
  "notifications": {
    "pickup_reminder": "Pickup Reminder",
    "pickup_tomorrow": "{{wasteType}} collection scheduled for {{time}}",
    "achievement_earned": "New Badge Earned!",
    "level_up": "Level Up! You've reached level {{level}}"
  },
  "waste_types": {
    "recyclable": "Recyclable",
    "organic": "Organic Waste",
    "e_waste": "E-Waste",
    "hazardous": "Hazardous Waste"
  },
  "errors": {
    "auth_required": "Authentication required",
    "invalid_credentials": "Invalid email or password",
    "waste_classification_failed": "Failed to classify waste item"
  }
}
```

### 11.2 Frontend i18n

```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import sw from './locales/sw.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      sw: { translation: sw }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

## 12. Performance Optimization

### 12.1 Database Query Optimization

```javascript
// utils/queryOptimizer.js
class QueryOptimizer {
  // Use lean() for read-only queries
  static async findWasteLogs(filters, page = 1, limit = 20) {
    return await WasteLog
      .find(filters)
      .select('type weight createdAt user')
      .populate('user', 'profile.firstName profile.lastName')
      .lean() // Returns plain JS objects, faster
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  // Aggregate with proper indexing
  static async getWasteStatsByMunicipality(municipalityId, startDate, endDate) {
    return await WasteLog.aggregate([
      {
        $match: {
          municipality: municipalityId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          totalWeight: { $sum: '$weight' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).allowDiskUse(true); // For large datasets
  }

  // Batch processing
  static async processWasteLogsBatch(logs) {
    const bulkOps = logs.map(log => ({
      insertOne: {
        document: log
      }
    }));

    return await WasteLog.bulkWrite(bulkOps, { ordered: false });
  }
}

module.exports = QueryOptimizer;
```

### 12.2 Caching Strategy

```javascript
// services/cacheService.js
const redis = require('../config/redis');

class CacheService {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  // Cache wrapper for functions
  async wrap(key, fn, ttl = 3600) {
    const cached = await this.get(key);
    if (cached !== null) return cached;

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}

module.exports = new CacheService();
```

## 13. MVP Launch Checklist

### Phase 1: Foundation (Weeks 1-4)
- [ ] Set up development environment
- [ ] Initialize MongoDB Atlas cluster
- [ ] Configure Redis for caching
- [ ] Implement authentication system
- [ ] Create user registration/login
- [ ] Set up basic API structure
- [ ] Design and implement database schemas
- [ ] Configure AWS S3 for file storage

### Phase 2: Core Features (Weeks 5-8)
- [ ] Build waste logging system
- [ ] Implement schedule management
- [ ] Create pickup calendar
- [ ] Develop notification system
- [ ] Integrate maps (Mapbox/Google)
- [ ] Build facility locator
- [ ] Implement basic gamification (points, levels)
- [ ] Create leaderboard

### Phase 3: AI Integration (Weeks 9-12)
- [ ] Integrate OpenAI/Claude for chatbot
- [ ] Implement RAG for context-aware responses
- [ ] Train image classification model
- [ ] Build image scanning feature
- [ ] Set up Python ML service
- [ ] Implement demand forecasting
- [ ] Create route optimization

### Phase 4: Frontend Development (Weeks 13-16)
- [ ] Build React web application
- [ ] Create React Native mobile app
- [ ] Implement all user-facing features
- [ ] Design responsive UI/UX
- [ ] Add real-time updates (WebSocket)
- [ ] Implement offline support (PWA)
- [ ] Integrate push notifications

### Phase 5: Testing & Deployment (Weeks 17-20)
- [ ] Write unit tests (80% coverage)
- [ ] Perform integration testing
- [ ] Conduct user acceptance testing
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging environment
- [ ] Performance testing and optimization
- [ ] Security audit
- [ ] Deploy to production

### Phase 6: Launch & Scale (Week 21+)
- [ ] Soft launch with pilot municipality
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Fix critical bugs
- [ ] Optimize based on usage patterns
- [ ] Plan feature enhancements
- [ ] Scale to additional municipalities

## 14. Cost Estimation (Monthly)

**Infrastructure:**
- MongoDB Atlas (M10): $57
- Redis Cloud: $30
- AWS EC2/ECS: $200-500
- AWS S3: $50
- Load Balancer: $30

**AI Services:**
- OpenAI API (GPT-4): $200-500 (usage-based)
- Mapbox: $0-200 (free tier + overage)
- Firebase (Push): $25

**Third-party:**
- SendGrid: $20
- Twilio: $50
- Monitoring (Sentry): $26

**Total: $688 - $1,438/month** for initial launch

## 15. Success Metrics

**User Engagement:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Feature adoption rates

**Environmental Impact:**
- Total waste collected (kg)
- Recycling rate (%)
- Waste diversion from landfills
- CO2 emissions reduced

**Operational Efficiency:**
- Collection route efficiency (%)
- Missed pickups (%)
- Average response time
- Cost per collection

**Gamification:**
- Average points per user
- Badge completion rate
- Leaderboard engagement
- User retention rate

---

This comprehensive plan provides a production-ready roadmap for building a scalable, AI-powered sustainable waste management application that aligns with UN SDG 11 goals.