import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Save, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { wasteAPI, municipalityAPI } from '../services/api';
import { toast } from 'react-toastify';

const LogWaste = () => {
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    weight: '',
    item: '',
    notes: '',
  });
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadWasteTypes();
  }, []);

  const loadWasteTypes = async () => {
    try {
      const response = await municipalityAPI.getWasteTypes('nairobi');
      setWasteTypes(response.data.data);
    } catch (error) {
      console.error('Failed to load waste types');
    }
  };

  const categories = {
    recyclable: ['plastic_bottle', 'plastic_container', 'paper', 'cardboard', 'glass_bottle', 'aluminum_can'],
    organic: ['food_waste', 'yard_waste', 'compostable'],
    'e-waste': ['electronics', 'battery', 'light_bulb'],
    hazardous: ['chemical', 'paint', 'oil'],
    general: ['mixed_waste', 'other'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await wasteAPI.logWaste(formData);
      setSubmitted(true);
      toast.success(`🎉 +${response.data.data.points} points earned!`);
      
      setTimeout(() => {
        setFormData({
          type: '',
          category: '',
          weight: '',
          item: '',
          notes: '',
        });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to log waste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center min-h-[600px]"
      >
        <Card className="text-center max-w-md">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Great Job!
          </h2>
          <p className="text-gray-600 mb-4">
            Your waste has been logged successfully
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            <CheckCircle className="w-5 h-5" />
            Making a difference! 🌍
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card title="Log Waste Disposal" icon="♻️" gradient>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waste Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Waste Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {wasteTypes.map((type) => (
                  <motion.button
                    key={type.type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, type: type.type, category: '' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === type.type
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-gray-800 text-sm capitalize">
                      {type.type.replace('_', ' ')}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            {formData.type && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories[formData.type]?.map((cat) => (
                    <Badge
                      key={cat}
                      variant={formData.category === cat ? 'success' : 'default'}
                      size="lg"
                      className="cursor-pointer justify-center"
                      onClick={() => setFormData({ ...formData, category: cat })}
                    >
                      {cat.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Description *
              </label>
              <input
                type="text"
                required
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                className="input-field"
                placeholder="e.g., Plastic water bottle"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="input-field"
                placeholder="0.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: More weight = more points!
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Any additional information..."
              />
            </div>

            {/* Guidelines */}
            {formData.type && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <h4 className="font-semibold text-blue-900 mb-2">
                  ℹ️ Disposal Guidelines
                </h4>
                <p className="text-sm text-blue-800">
                  {wasteTypes.find(t => t.type === formData.type)?.guidelines}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.type || !formData.category || !formData.item}
              className="w-full"
              icon={<Save className="w-5 h-5" />}
            >
              Log Waste & Earn Points
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LogWaste;
