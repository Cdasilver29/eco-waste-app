// src/components/waste/WasteLogger.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, MapPin, Weight, Sparkles, Check } from 'lucide-react';

export const WasteLogger = ({ onLog }) => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [wasteType, setWasteType] = useState('');
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const wasteTypes = [
    { id: 'recyclable', name: 'Recyclable', icon: '♻️', color: 'from-emerald-400 to-teal-600', points: 10 },
    { id: 'organic', name: 'Organic', icon: '🌱', color: 'from-green-400 to-lime-600', points: 8 },
    { id: 'general', name: 'General', icon: '🗑️', color: 'from-slate-400 to-gray-600', points: 5 },
    { id: 'hazardous', name: 'Hazardous', icon: '⚠️', color: 'from-red-400 to-rose-600', points: 15 }
  ];

  const categories = {
    recyclable: ['Plastic', 'Paper', 'Glass', 'Metal', 'Cardboard'],
    organic: ['Food Scraps', 'Garden Waste', 'Compostable'],
    general: ['Mixed Waste', 'Non-recyclable'],
    hazardous: ['Batteries', 'Electronics', 'Chemicals', 'Medical']
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setStep(2);
      
      // Simulate AI classification
      setTimeout(() => {
        setAiSuggestion({
          type: 'recyclable',
          category: 'Plastic',
          confidence: 0.92
        });
      }, 1500);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const logData = {
      image,
      type: wasteType,
      category,
      weight: parseFloat(weight),
      location
    };

    // Call API or parent handler
    if (onLog) {
      await onLog(logData);
    }

    setLoading(false);
    setStep(4);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-600"
        />
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload Image */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Log Your Waste</h2>
              <p className="text-slate-600 mb-8">Take a photo or upload an image of your waste</p>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="text-slate-700 font-medium">Click to upload image</div>
                  <div className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</div>
                </motion.button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <span>Open Camera</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Type */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Waste preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">AI Suggestion</span>
                  </div>
                  <p className="text-purple-800">
                    Detected: <strong>{aiSuggestion.category}</strong> ({(aiSuggestion.confidence * 100).toFixed(0)}% confident)
                  </p>
                </motion.div>
              )}

              <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Waste Type</h2>

              <div className="grid grid-cols-2 gap-4">
                {wasteTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setWasteType(type.id);
                      setStep(3);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      wasteType === type.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {type.icon}
                    </div>
                    <div className="font-semibold text-slate-800">{type.name}</div>
                    <div className="text-sm text-emerald-600 mt-1">+{type.points} points</div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-slate-600 hover:text-slate-800 font-medium"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Details</h2>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select category</option>
                    {categories[wasteType]?.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.0"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <button
                    onClick={getCurrentLocation}
                    disabled={loading || location}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
                      location
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 hover:border-emerald-500 text-slate-700'
                    }`}
                  >
                    {location ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Location Added</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5" />
                        <span>{loading ? 'Getting location...' : 'Add Current Location'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!category || !weight || loading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Logging...' : 'Log Waste'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-slate-800 mb-2">Great Job! 🎉</h2>
              <p className="text-slate-600 mb-6">Your waste has been logged successfully</p>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8">
                <div className="text-4xl font-bold text-emerald-600 mb-2">+25 Points</div>
                <div className="text-slate-600">You're making a difference!</div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setImage(null);
                  setImagePreview(null);
                  setWasteType('');
                  setCategory('');
                  setWeight('');
                  setLocation(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg"
              >
                Log Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WasteLogger;