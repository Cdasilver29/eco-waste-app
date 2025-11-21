import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Building } from 'lucide-react';
import { register } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: 'Nairobi',
    role: 'citizen', // Added role selection
    companyName: '' // Added for manufacturers
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enhanced registration with role
      await dispatch(register({ ...formData })).unwrap();
      
      // Store user data with role
      const userData = {
        id: '1',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        tokens: formData.role === 'citizen' ? 50 : 0, // Starting bonus
        level: 1,
        rating: 5.0,
        companyName: formData.companyName,
        phone: formData.phone,
        city: formData.city
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success(`Account created! Welcome to EcoWaste 🎉`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ♻️
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Join EcoWaste
          </h2>
          <p className="mt-2 text-gray-600">
            Start your sustainable journey today
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
        >
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
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
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Company Name for Manufacturers */}
            {formData.role === 'manufacturer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pl-10"
                  placeholder="+254712345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field pl-10"
                >
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Join as {formData.role === 'citizen' ? 'Citizen' : 'Manufacturer'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
