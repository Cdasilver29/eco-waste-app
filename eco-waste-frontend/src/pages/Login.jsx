import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { login } from '../store/slices/authSlice';
import Button from '../components/common/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen' // Default role
  });

  // Handles the login process
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form auto-submit
    try {
      // Dispatch login action and wait for result
      const result = await dispatch(login({ ...formData })).unwrap();

      // Save user in localStorage for dashboard routing
      localStorage.setItem('user', JSON.stringify(result.user));

      toast.success(`Welcome back, ${result.user.firstName || result.user.companyName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Invalid email or password');
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
            Welcome Back!
          </h2>
          <p className="mt-2 text-gray-600">
            Continue your eco-friendly journey
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Sign In Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In as {formData.role === 'citizen' ? 'Citizen' : 'Manufacturer'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 font-semibold hover:text-green-700">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-semibold mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-600">Email: john@example.com</p>
            <p className="text-xs text-blue-600">Password: password123</p>
            <p className="text-xs text-blue-600 mt-1">
              Role: {formData.role === 'citizen' ? 'Citizen' : 'Manufacturer'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

