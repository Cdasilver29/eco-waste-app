const OpenAI = require('openai');
const sharp = require('sharp');
const Municipality = require('../models/Municipality');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ImageRecognitionService {
  constructor() {
    this.wasteCategories = [
      'plastic_bottle',
      'plastic_container',
      'paper',
      'cardboard',
      'glass_bottle',
      'glass_jar',
      'aluminum_can',
      'steel_can',
      'food_waste',
      'yard_waste',
      'electronics',
      'battery',
      'light_bulb',
      'textile',
      'mixed_waste',
      'other'
    ];
  }

  async processImage(imageBuffer) {
    try {
      // Optimize image: resize and compress
      const processedImage = await sharp(imageBuffer)
        .resize(800, 800, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      return processedImage;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  }

  async classifyWithVisionAPI(imageBuffer) {
    try {
      // Process image first
      const processedImage = await this.processImage(imageBuffer);
      
      // Convert to base64
      const base64Image = processedImage.toString('base64');

      // Call OpenAI Vision API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and identify the waste item(s). Provide:

1. **Primary Category**: Choose ONE from: ${this.wasteCategories.join(', ')}
2. **Waste Type**: recyclable, organic, e-waste, hazardous, or general
3. **Confidence**: 0.0 to 1.0
4. **Item Description**: Brief description
5. **Recycling Instructions**: How to properly dispose of this item
6. **Special Notes**: Any important handling or preparation steps

Respond ONLY with valid JSON in this exact format:
{
  "category": "category_name",
  "wasteType": "waste_type",
  "confidence": 0.95,
  "description": "item description",
  "instructions": "disposal instructions",
  "notes": "special notes if any"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3 // Lower temperature for more consistent results
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON response
      let result;
      try {
        // Remove markdown code blocks if present
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('JSON parse error:', content);
        throw new Error('Failed to parse AI response');
      }

      // Validate and normalize result
      if (!result.category || !result.wasteType) {
        throw new Error('Invalid AI response format');
      }

      return {
        category: result.category,
        wasteType: result.wasteType,
        confidence: result.confidence || 0.5,
        description: result.description || 'Unknown item',
        instructions: result.instructions || 'Please check with your local facility',
        notes: result.notes || '',
        method: 'vision_api',
        tokensUsed: response.usage.total_tokens
      };
    } catch (error) {
      console.error('Vision API error:', error);
      throw new Error(`Image classification failed: ${error.message}`);
    }
  }

  async getDisposalInstructions(category, wasteType, municipalityId) {
    try {
      const municipality = await Municipality.findById(municipalityId);
      
      if (!municipality) {
        return {
          guidelines: 'Please check with your local waste management facility',
          facilities: []
        };
      }

      // Find matching waste type configuration
      const wasteTypeConfig = municipality.config.wasteTypes.find(
        wt => wt.type.toLowerCase() === wasteType.toLowerCase()
      );

      // Find relevant facilities
      const relevantFacilities = municipality.facilities.filter(f => {
        const categoryMatch = f.acceptedMaterials.some(
          material => material.toLowerCase().includes(category.toLowerCase()) ||
                     category.toLowerCase().includes(material.toLowerCase())
        );
        return categoryMatch;
      });

      return {
        guidelines: wasteTypeConfig?.guidelines || 'Check with local facility',
        color: wasteTypeConfig?.color,
        icon: wasteTypeConfig?.icon,
        facilities: relevantFacilities.map(f => ({
          name: f.name,
          type: f.type,
          address: f.address,
          phone: f.phone,
          location: f.location.coordinates
        }))
      };
    } catch (error) {
      console.error('Get disposal instructions error:', error);
      return {
        guidelines: 'Unable to fetch local guidelines',
        facilities: []
      };
    }
  }

  async enhanceClassification(classificationResult, municipalityId) {
    try {
      const disposal = await this.getDisposalInstructions(
        classificationResult.category,
        classificationResult.wasteType,
        municipalityId
      );

      return {
        ...classificationResult,
        disposal
      };
    } catch (error) {
      console.error('Enhance classification error:', error);
      return classificationResult;
    }
  }

  validateImageSize(imageBuffer) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageBuffer.length > maxSize) {
      throw new Error('Image size exceeds 5MB limit');
    }
    return true;
  }

  async getImageMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: imageBuffer.length
      };
    } catch (error) {
      console.error('Get metadata error:', error);
      return null;
    }
  }
}

module.exports = new ImageRecognitionService();
