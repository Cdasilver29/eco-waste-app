import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Leaf, User, Building } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../store/slices/authSlice';

const LoginForm = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState('citizen'); // 'citizen' or 'manufacturer'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ general: 'Please fill in all fields' });
      return;
    }

    try {
      const result = await dispatch(login({ email, password, role: userRole })).unwrap();

      // Save user in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));

      toast.success(`Welcome back, ${result.user.firstName || result.user.companyName || 'User'}!`);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message || 'Invalid email or password' });
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-emerald-100">Continue your eco journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                I am a...
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
                    onClick={() => setUserRole(role.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      userRole === role.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <role.icon className={`w-6 h-6 mb-2 ${
                      userRole === role.id ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                    <div className={`font-semibold text-sm ${
                      userRole === role.id ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {role.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{role.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In as ' + (userRole === 'citizen' ? 'Citizen' : 'Manufacturer')}
            </motion.button>

            {/* Switch to Register */}
            <div className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
