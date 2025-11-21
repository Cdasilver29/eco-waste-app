import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, User, Building, Eye, EyeOff } from 'lucide-react';

export const RegisterForm = ({ onSubmit, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    municipality: '',
    role: 'citizen', // Added role
    companyName: '' // Added for manufacturers
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const municipalities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.municipality) newErrors.municipality = 'Please select a municipality';
    if (formData.role === 'manufacturer' && !formData.companyName) {
      newErrors.companyName = 'Company name is required for manufacturers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Leaf className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Join EcoWaste</h1>
            <p className="text-emerald-100">Start making a difference today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {errors.general && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                I want to join as a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'citizen', label: 'Citizen', icon: User, description: 'Log waste & earn tokens' },
                  { id: 'manufacturer', label: 'Manufacturer', icon: Building, description: 'Source materials' }
                ].map((role) => (
                  <motion.button
                    key={role.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('role', role.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === role.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <role.icon className={`w-5 h-5 mb-2 ${
                      formData.role === role.id ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                    <div className={`font-semibold text-sm ${
                      formData.role === role.id ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {role.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{role.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {formData.role === 'citizen' ? 'Full Name' : 'Contact Person Name'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={formData.role === 'citizen' ? 'John Doe' : 'Your full name'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Company Name (Manufacturer only) */}
            {formData.role === 'manufacturer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {formData.role === 'citizen' ? 'Municipality' : 'Business Location'}
              </label>
              <select
                value={formData.municipality}
                onChange={(e) => handleChange('municipality', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">Select your city</option>
                {municipalities.map(city => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>
              {errors.municipality && <p className="mt-1 text-sm text-red-600">{errors.municipality}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 mt-6"
            >
              {loading ? 'Creating Account...' : `Join as ${formData.role === 'citizen' ? 'Citizen' : 'Manufacturer'}`}
            </motion.button>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;