import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { imageAPI } from '../services/api';
import { toast } from 'react-toastify';

const ScanItem = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setResult(null);
    setLogged(false);
  };

  const handleClassify = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await imageAPI.classify(formData);
      setResult(response.data.data);
      toast.success('Item classified! 🎯');
    } catch (error) {
      toast.error('Classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanAndLog = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('weight', '0.5');
      formData.append('notes', 'Scanned with AI');

      const response = await imageAPI.scanAndLog(formData);
      setLogged(true);
      toast.success(`🎉 +${response.data.data.points} points earned!`);
    } catch (error) {
      toast.error('Failed to log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setLogged(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card title="AI Waste Scanner" icon="📸" gradient>
          {!preview ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  📸
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Scan Your Item
                </h3>
                <p className="text-gray-600 mb-8">
                  Take a photo or upload an image to identify waste type
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => {
                      fileInputRef.current.setAttribute('capture', 'environment');
                      fileInputRef.current.click();
                    }}
                    icon={<Camera className="w-5 h-5" />}
                  >
                    Take Photo
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      fileInputRef.current.removeAttribute('capture');
                      fileInputRef.current.click();
                    }}
                    icon={<Upload className="w-5 h-5" />}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">
                  💡 How it works
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Take a clear photo of the waste item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>AI identifies the waste type instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Get disposal instructions and earn points</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden border-4 border-green-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-gray-100"
                />
              </div>

              {/* Classification Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-green-800 mb-1">
                            {result.category.replace('_', ' ')}
                          </h3>
                          <p className="text-green-600">{result.description}</p>
                        </div>
                        <Badge variant="success" size="lg">
                          {(result.confidence * 100).toFixed(0)}% confident
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <Badge variant={
                          result.wasteType === 'recyclable' ? 'success' :
                          result.wasteType === 'organic' ? 'info' :
                          result.wasteType === 'e-waste' ? 'warning' :
                          result.wasteType === 'hazardous' ? 'danger' : 'default'
                        }>
                          {result.wasteType}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-green-900 mb-1">
                            📋 Disposal Instructions:
                          </h4>
                          <p className="text-green-700 text-sm">
                            {result.instructions}
                          </p>
                        </div>

                        {result.notes && (
                          <div>
                            <h4 className="font-semibold text-green-900 mb-1">
                              ⚠️ Special Notes:
                            </h4>
                            <p className="text-green-700 text-sm">
                              {result.notes}
                            </p>
                          </div>
                        )}

                        {result.disposal?.facilities && result.disposal.facilities.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-900 mb-2">
                              📍 Nearby Facilities:
                            </h4>
                            <div className="space-y-2">
                              {result.disposal.facilities.map((facility, idx) => (
                                <div key={idx} className="text-sm bg-white rounded-lg p-3 border border-green-200">
                                  <p className="font-medium text-gray-800">{facility.name}</p>
                                  <p className="text-gray-600 text-xs">{facility.address}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {logged ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-center bg-green-100 rounded-xl p-6 border-2 border-green-300"
                      >
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-green-800 mb-2">
                          Logged Successfully!
                        </h3>
                        <p className="text-green-700">
                          Keep up the great work! 🌍
                        </p>
                      </motion.div>
                    ) : (
                      <Button
                        onClick={handleScanAndLog}
                        loading={loading}
                        className="w-full"
                        icon={<CheckCircle className="w-5 h-5" />}
                      >
                        Log This Item & Earn Points
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {!result && (
                  <Button
                    onClick={handleClassify}
                    loading={loading}
                    className="col-span-2"
                    icon={loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                  >
                    {loading ? 'Analyzing...' : 'Classify Item'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={reset}
                  className={result ? '' : 'col-span-2'}
                >
                  {result ? 'Scan Another' : 'Choose Different Image'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ScanItem;
