// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Leaf, Recycle, TrendingUp, Users, MapPin, Sparkles, 
  ArrowRight, Play, Check, Award, Globe, Zap, Menu, X,
  Factory, Coins, Navigation, Camera, BarChart3, Shield,
  Clock, Package, DollarSign, Truck, Target, ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
    setShowLanguages(false);
  };

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Enhanced features with real app functionality
  const features = [
    {
      icon: Camera,
      title: "AI Waste Recognition",
      description: "Snap a photo of your waste. Our AI instantly identifies the type and category, guiding you on proper disposal.",
      color: "from-emerald-400 to-teal-600",
      stats: "95% accuracy"
    },
    {
      icon: Coins,
      title: "Token Rewards System",
      description: "Earn tokens for every kg of waste logged. Convert tokens to real money or redeem for rewards from partner merchants.",
      color: "from-amber-400 to-orange-600",
      stats: "Up to KSh 50/kg"
    },
    {
      icon: Factory,
      title: "Manufacturer Matching",
      description: "We connect your recyclables directly to manufacturers who need them. Your plastic bottles go to plastic manufacturers, paper to paper mills.",
      color: "from-blue-400 to-indigo-600",
      stats: "200+ manufacturers"
    },
    {
      icon: MapPin,
      title: "Smart Collection Routes",
      description: "Real-time tracking of collection trucks. Get notified when they're nearby. Find the nearest drop-off points with live navigation.",
      color: "from-purple-400 to-pink-600",
      stats: "Live tracking"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Manufacturers see live data on waste availability by type, location, and quantity. Plan your supply chain efficiently.",
      color: "from-cyan-400 to-blue-600",
      stats: "Live dashboard"
    },
    {
      icon: TrendingUp,
      title: "Impact Gamification",
      description: "Climb leaderboards, unlock badges, maintain streaks. Compete with your community while saving the planet.",
      color: "from-pink-400 to-rose-600",
      stats: "8 badges to earn"
    }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      icon: Camera,
      title: "Snap & Classify",
      description: "Take a photo of your waste. Our AI identifies the type (plastic, paper, metal, organic) and tells you its value.",
      color: "from-emerald-400 to-teal-600"
    },
    {
      step: "02",
      icon: MapPin,
      title: "Find Collection Point",
      description: "See nearby drop-off points or schedule a pickup. Real-time map shows collection trucks and their routes.",
      color: "from-blue-400 to-cyan-600"
    },
    {
      step: "03",
      icon: Package,
      title: "Drop Off or Get Picked Up",
      description: "Drop waste at designated points or wait for the collection truck. Track the truck in real-time on your phone.",
      color: "from-purple-400 to-pink-600"
    },
    {
      step: "04",
      icon: Factory,
      title: "Manufacturer Connection",
      description: "Your waste is routed to manufacturers who need it. Plastic → Plastic manufacturers, Paper → Paper mills, etc.",
      color: "from-amber-400 to-orange-600"
    },
    {
      step: "05",
      icon: DollarSign,
      title: "Earn Token Rewards",
      description: "Get tokens based on waste type and weight. 1 kg plastic = 50 tokens. Convert to cash via M-Pesa or bank transfer.",
      color: "from-green-400 to-emerald-600"
    }
  ];

  const wasteCategories = [
    {
      name: "Plastic",
      icon: "♻️",
      value: "50 tokens/kg",
      manufacturers: "Bottle manufacturers, Packaging companies",
      color: "from-blue-400 to-cyan-600"
    },
    {
      name: "Paper",
      icon: "📄",
      value: "30 tokens/kg",
      manufacturers: "Paper mills, Cardboard makers",
      color: "from-amber-400 to-orange-600"
    },
    {
      name: "Metal",
      icon: "🔩",
      value: "80 tokens/kg",
      manufacturers: "Steel mills, Aluminum refiners",
      color: "from-slate-400 to-gray-600"
    },
    {
      name: "Glass",
      icon: "🍾",
      value: "25 tokens/kg",
      manufacturers: "Glass factories, Bottle makers",
      color: "from-emerald-400 to-teal-600"
    },
    {
      name: "E-Waste",
      icon: "💻",
      value: "100 tokens/kg",
      manufacturers: "Electronics recyclers, Metal extractors",
      color: "from-purple-400 to-pink-600"
    },
    {
      name: "Organic",
      icon: "🌱",
      value: "15 tokens/kg",
      manufacturers: "Compost producers, Biogas plants",
      color: "from-green-400 to-lime-600"
    }
  ];

  const manufacturerBenefits = [
    {
      icon: Target,
      title: "Real-Time Waste Availability",
      description: "See live data on waste types, quantities, and locations. Plan your procurement based on real-time supply.",
      stat: "Updated every 5 minutes"
    },
    {
      icon: Navigation,
      title: "GPS-Tracked Supply Chain",
      description: "Track waste from collection to delivery. Know exactly when materials will arrive at your facility.",
      stat: "End-to-end visibility"
    },
    {
      icon: BarChart3,
      title: "Quality Analytics",
      description: "AI-verified waste quality ratings. Filter by purity levels, contamination rates, and processing requirements.",
      stat: "95% quality accuracy"
    },
    {
      icon: DollarSign,
      title: "Dynamic Pricing",
      description: "Set your own token rates based on market demand. Attract more suppliers with competitive token rewards.",
      stat: "Flexible pricing"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mwangi",
      role: "Small Business Owner, Nairobi",
      content: "I used to throw away plastic bottles. Now I earn KSh 2,500/month by recycling them! The app shows me exactly where to take them and tracks my earnings. It's like having a side hustle that helps the planet.",
      avatar: "👩🏾‍💼",
      location: "Westlands, Nairobi",
      earnings: "KSh 2,500/mo",
      rating: 5
    },
    {
      name: "David Kimani",
      role: "Restaurant Manager, Mombasa",
      content: "Our restaurant generates tons of cardboard and food waste. EcoWaste connected us with a biogas company and a paper recycler. We now earn KSh 15,000 monthly and reduced our disposal costs by 80%. Win-win!",
      avatar: "👨🏿‍🍳",
      location: "Nyali, Mombasa",
      earnings: "KSh 15,000/mo",
      rating: 5
    },
    {
      name: "Grace Wanjiru",
      role: "Waste Collector & Mother of 3",
      content: "This app changed my life. I collect waste from my neighborhood, log it through the app, and get paid directly to my M-Pesa. I'm supporting my family and teaching my kids about recycling. The real-time tracking helps me plan my routes efficiently.",
      avatar: "👩🏾",
      location: "Kibera, Nairobi",
      earnings: "KSh 8,000/mo",
      rating: 5
    },
    {
      name: "John Ochieng",
      role: "School Teacher, Kisumu",
      content: "I introduced EcoWaste to our school. Students compete on the leaderboard, and we've earned enough tokens to buy computers for the lab! The kids are learning about sustainability while making real impact.",
      avatar: "👨🏿‍🏫",
      location: "Kisumu Central",
      earnings: "KSh 22,000 raised",
      rating: 5
    },
    {
      name: "Fatuma Hassan",
      role: "Community Leader, Garissa",
      content: "Before EcoWaste, waste was everywhere in our neighborhood. Now everyone is collecting it for tokens. Our streets are cleaner, and people are earning extra income. The AI makes it so easy - even my grandmother uses it!",
      avatar: "👳🏾‍♀️",
      location: "Garissa Town",
      earnings: "Community impact",
      rating: 5
    },
    {
      name: "Peter Mutua",
      role: "Manufacturer, Thika",
      content: "As a plastic bottle manufacturer, finding quality recyclables was always a challenge. EcoWaste gives me real-time data on available plastic waste across Kenya. I can see quality ratings, quantities, and locations. My procurement is now 10x more efficient!",
      avatar: "👨🏿‍💼",
      location: "Thika Industrial Area",
      earnings: "70% cost reduction",
      rating: 5
    }
  ];

  const impactStats = [
    { value: "50K+", label: "Active Recyclers", icon: Users, subtext: "Earning tokens daily" },
    { value: "2.5M", label: "Kg Recycled", icon: Recycle, subtext: "Last 30 days" },
    { value: "200+", label: "Manufacturers", icon: Factory, subtext: "Connected to supply" },
    { value: "KSh 8.5M", label: "Tokens Earned", icon: Coins, subtext: "Paid to recyclers" }
  ];

  const benefits = [
    "AI-powered instant waste identification",
    "Real-time collection truck tracking with ETA",
    "Token rewards convertible to M-Pesa or cash",
    "Direct connection to manufacturers who buy your waste",
    "Community leaderboards with prizes",
    "Personalized recycling routes & schedules",
    "Live waste market prices by category",
    "Impact dashboard showing your CO₂ reduction",
    "Gamification with badges & achievements",
    "Municipal pickup notifications",
    "Quality verification & ratings",
    "Secure blockchain token transactions"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 px-4 md:px-6 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10 sticky top-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              EcoWaste
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {[
              { name: t('nav.howItWorks'), id: 'how-it-works' },
              { name: t('nav.wasteCategories'), id: 'categories' },
              { name: t('nav.forManufacturers'), id: 'manufacturers' },
              { name: t('nav.testimonials'), id: 'testimonials' }
            ].map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher - Single Circle Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">{currentLanguage.flag}</span>
              </motion.button>

              {showLanguages && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 right-0 bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[160px] z-50"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-all flex items-center space-x-3 ${
                        i18n.language === lang.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                      {i18n.language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <motion.button 
                onClick={handleLogin}
                className="px-4 lg:px-6 py-2 text-emerald-400 border border-emerald-400 rounded-full font-semibold hover:bg-emerald-400/10 transition-all text-sm lg:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('nav.login')}
              </motion.button>

              <motion.button 
                onClick={handleGetStarted}
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all text-sm lg:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('nav.startEarning')}
              </motion.button>
            </div>
          </div>

          <motion.button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            {[
              { name: t('nav.howItWorks'), id: 'how-it-works' },
              { name: t('nav.wasteCategories'), id: 'categories' },
              { name: t('nav.forManufacturers'), id: 'manufacturers' },
              { name: t('nav.testimonials'), id: 'testimonials' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="px-4 pt-3 border-t border-white/10 space-y-2">
              <button 
                onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                className="w-full py-3 text-emerald-400 border border-emerald-400 rounded-full font-semibold hover:bg-emerald-400/10 transition-all"
              >
                {t('nav.login')}
              </button>
              <button 
                onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                {t('nav.startEarning')}
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 pt-12 md:pt-20 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            style={{ opacity, scale }}
            className="text-center space-y-6 md:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30"
            >
              <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs md:text-sm text-emerald-300">
                {t('hero.badge')}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight px-4"
            >
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4"
            >
              <motion.button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold text-base md:text-lg flex items-center justify-center space-x-2 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="w-5 h-5" />
                <span>{t('hero.ctaStart')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                onClick={() => setIsVideoPlaying(true)}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-base md:text-lg flex items-center justify-center space-x-2 border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>{t('hero.ctaWatch')}</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 pt-4"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.noFees')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.instantPayouts')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.aiVerification')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Impact Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4"
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 md:p-6 bg-white/5 backdrop-blur-lg rounded-xl md:rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all"
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 mb-2 md:mb-3" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-xs md:text-sm mb-1">{stat.label}</div>
                <div className="text-emerald-400 text-xs">{stat.subtext}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-4 md:px-6 py-12 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How EcoWaste Works</h2>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              From waste to wealth in 5 simple steps. Start earning today.
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-white/10">{step.step}</div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                  <p className="text-base md:text-lg text-gray-400">{step.description}</p>
                </div>
                
                {/* UPDATED IMAGE SECTION */}
                <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <div className="relative aspect-video">
                    <img 
                      src={`/images/steps/step-${step.step}.jpg`}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to gradient background if image not found
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = `linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))`;
                      }}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    
                    {/* Step badge overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{step.title}</div>
                        <div className="text-xs text-emerald-300">Step {step.step}</div>
                      </div>
                    </div>
                    
                    {/* Fallback icon if image doesn't load */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <step.icon className="w-24 h-24 text-white/20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste Categories & Token Values */}
      <section id="categories" className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Waste Categories & Token Values</h2>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              Know what your waste is worth. AI identifies the category, we show you the value.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {wasteCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <div className="text-2xl font-bold text-emerald-400 mb-3">{category.value}</div>
                <div className="text-sm text-gray-400 mb-3">
                  <strong className="text-gray-300">Buyers:</strong> {category.manufacturers}
                </div>
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>High demand</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 md:p-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl border border-amber-500/30"
          >
            <div className="flex items-start space-x-4">
              <Coins className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">How Token Conversion Works</h3>
                <p className="text-gray-300 mb-4">
                  1 Token = KSh 1. Log waste → Earn tokens → Convert to M-Pesa or bank account. 
                  Minimum withdrawal: 100 tokens (KSh 100). Instant transfer, no fees.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="font-bold text-amber-400">100 tokens</div>
                    <div className="text-gray-400">= KSh 100 (2 kg plastic)</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="font-bold text-amber-400">500 tokens</div>
                    <div className="text-gray-400">= KSh 500 (6 kg metal)</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="font-bold text-amber-400">1000 tokens</div>
                    <div className="text-gray-400">= KSh 1,000 (20 kg paper)</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Manufacturers */}
      <section id="manufacturers" className="relative z-10 px-4 md:px-6 py-12 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
              <Factory className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">For Manufacturers</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Real-Time Waste Supply Chain</h2>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              Access verified, GPS-tracked recyclables. See live availability, quality ratings, and delivery ETAs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {manufacturerBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 md:p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 mb-3">{benefit.description}</p>
                    <div className="inline-flex items-center space-x-2 text-sm text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span>{benefit.stat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl border border-blue-500/30"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Live Dashboard Preview</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">1,247 kg</div>
                <div className="text-gray-300 mb-1">Plastic (PET) Available</div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Nairobi Industrial Area</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-emerald-400">Quality: 95%</span>
                  <span className="text-amber-400">50 tokens/kg</span>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">892 kg</div>
                <div className="text-gray-300 mb-1">Cardboard Available</div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Thika Warehouses</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-emerald-400">Quality: 88%</span>
                  <span className="text-amber-400">30 tokens/kg</span>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">345 kg</div>
                <div className="text-gray-300 mb-1">Aluminum Available</div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Mombasa Collection Points</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-emerald-400">Quality: 92%</span>
                  <span className="text-amber-400">80 tokens/kg</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <Factory className="w-5 h-5" />
                <span>Register as Manufacturer</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-base md:text-xl text-gray-400">
              Everything you need in one app
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                <div className="text-xs text-emerald-400 font-semibold">{feature.stats}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What People Say - Enhanced Testimonials */}
      <section id="testimonials" className="relative z-10 px-4 md:px-6 py-12 md:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Real Stories, Real Impact</h2>
            <p className="text-base md:text-xl text-gray-400">
              Hear from 50,000+ users earning and making a difference
            </p>
          </motion.div>

          {/* Featured Testimonial Carousel */}
          <div className="relative mb-12">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-500/30"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-8xl md:text-9xl">{testimonials[activeTestimonial].avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        ⭐
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-white mb-6 italic">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <div className="font-bold text-lg">{testimonials[activeTestimonial].name}</div>
                      <div className="text-gray-400 text-sm">{testimonials[activeTestimonial].role}</div>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{testimonials[activeTestimonial].location}</span>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div className="px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold">{testimonials[activeTestimonial].earnings}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Carousel Dots */}
            <div className="flex justify-center items-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{testimonial.avatar}</div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">"{testimonial.content}"</p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400">{testimonial.earnings}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Why 50,000+ Kenyans Trust EcoWaste</h2>
              <p className="text-base md:text-xl text-gray-400 mb-8">
                Join the movement. Turn waste into wealth while contributing to UN SDG 11 (Sustainable Cities).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.slice(0, 8).map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all inline-flex items-center space-x-2"
              >
                <Coins className="w-6 h-6" />
                <span>Start Earning Today</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 backdrop-blur-sm border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Globe className="w-10 h-10 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">50+ Cities Covered</div>
                      <div className="text-sm text-gray-400">Pan-Kenya coverage</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Shield className="w-10 h-10 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Secure & Verified</div>
                      <div className="text-sm text-gray-400">AI quality checks</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <Truck className="w-10 h-10 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Real-Time Tracking</div>
                      <div className="text-sm text-gray-400">GPS-enabled trucks</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                    <DollarSign className="w-10 h-10 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Instant Payouts</div>
                      <div className="text-sm text-gray-400">M-Pesa in seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-8 md:p-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl border border-emerald-500/30"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-6"
          >
            💰
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Turn Waste Into Wealth?</h2>
          <p className="text-base md:text-xl text-gray-300 mb-8">
            Join 50,000+ Kenyans earning an average of KSh 5,000/month. Start today - no signup fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all inline-flex items-center justify-center space-x-2"
            >
              <Coins className="w-6 h-6" />
              <span>Start Earning Now</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            <motion.button 
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-12 py-5 border-2 border-emerald-400 text-emerald-400 rounded-full font-bold text-lg hover:bg-emerald-400/10 transition-all"
            >
              Already a member? Login
            </motion.button>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Instant payouts</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-8 md:py-12 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">EcoWaste</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Turn waste into wealth. AI-powered waste management connecting recyclers with manufacturers across Kenya. Earn tokens, track collections, save the planet.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Instagram</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Quick Links</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#how-it-works" className="block hover:text-white transition-colors">How It Works</a>
                <a href="#categories" className="block hover:text-white transition-colors">Waste Categories</a>
                <a href="#manufacturers" className="block hover:text-white transition-colors">For Manufacturers</a>
                <a href="#testimonials" className="block hover:text-white transition-colors">Testimonials</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Legal</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-white transition-colors">Token Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>© 2024 EcoWaste Kenya. All rights reserved. | Building sustainable cities for future generations 🌍</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-4xl bg-black/90 rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl font-bold transition-all"
            >
              ×
            </button>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="EcoWaste - How It Works"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
