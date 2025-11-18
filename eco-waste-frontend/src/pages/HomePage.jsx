import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Recycle, TrendingUp, Users, MapPin, Sparkles, ArrowRight, Play, Check, Award, Globe, Zap } from 'lucide-react';

const HomePage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const features = [
    {
      icon: Recycle,
      title: "AI-Powered Sorting",
      description: "Smart waste classification using advanced computer vision",
      color: "from-emerald-400 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Gamified Rewards",
      description: "Earn points, badges, and climb the leaderboard",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Track collection vehicles and find nearby facilities",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: Sparkles,
      title: "Smart Analytics",
      description: "Visualize your environmental impact in real-time",
      color: "from-amber-400 to-orange-600"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "2.5M", label: "Kg Recycled", icon: Recycle },
    { value: "12K", label: "CO₂ Saved (tons)", icon: Leaf },
    { value: "98%", label: "User Satisfaction", icon: Award }
  ];

  const benefits = [
    "AI-powered waste recognition",
    "Real-time collection tracking",
    "Personalized recycling tips",
    "Community leaderboards",
    "Carbon footprint tracking",
    "Municipal integration"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 px-6 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              EcoWaste
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'About', 'Impact', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <motion.button 
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            style={{ opacity, scale }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">AI-Powered Waste Management</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              Revolutionize
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Waste Management
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Transform your city into a sustainable paradise with AI-powered recycling,
              gamification, and real-time tracking. Join 50,000+ eco-warriors today.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold text-lg flex items-center space-x-2 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Recycling</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-lg flex items-center space-x-2 border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all"
              >
                <stat.icon className="w-8 h-8 text-emerald-400 mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">Everything you need for sustainable waste management</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6">Why Choose EcoWaste?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of users making a real environmental impact with cutting-edge technology
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 backdrop-blur-sm border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                <div className="relative space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Globe className="w-10 h-10 text-emerald-400" />
                    <div>
                      <div className="font-semibold">Global Impact</div>
                      <div className="text-sm text-gray-400">Operating in 50+ cities</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Zap className="w-10 h-10 text-blue-400" />
                    <div>
                      <div className="font-semibold">Lightning Fast</div>
                      <div className="text-sm text-gray-400">Real-time processing</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Award className="w-10 h-10 text-purple-400" />
                    <div>
                      <div className="font-semibold">Award Winning</div>
                      <div className="text-sm text-gray-400">UN SDG recognized</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl border border-white/10"
        >
          <h2 className="text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community and start your sustainable journey today
          </p>
          <motion.button 
            className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">EcoWaste</span>
          </div>
          <p className="text-gray-400 mb-4">Building sustainable cities for future generations</p>
          <p className="text-sm text-gray-500">© 2024 EcoWaste. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;