import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Share2,
  Users,
  ArrowRight,
  Github,
  Linkedin,
  Sun,
  Moon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import lightLogo from '../assets/logos/light/mgms-logo.png';
import darkLogo from '../assets/logos/dark/mgms-logo.png';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  
  const features = [
    {
      icon: Shield,
      title: 'Secure Media Management',
      description:
        'Enterprise-grade security for your media assets with encrypted storage and access controls.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast Access',
      description:
        'Optimized performance ensures instant access to your media library, no matter the size.',
    },
    {
      icon: Share2,
      title: 'Smart Sharing',
      description:
        'Share your media with precision. Control who sees what, when, and for how long.',
    },
    {
      icon: Users,
      title: 'Built for Professionals',
      description:
        'Designed with professionals in mind. Powerful features that scale with your needs.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:bg-luxury-dark text-slate-900 dark:text-gray-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:gradient-mesh opacity-50 dark:opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,36,116,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.05),transparent_50%)]" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200/70 dark:border-white/10 backdrop-blur-xl bg-white/80 dark:bg-luxury-dark/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link to="/landing" className="hover:opacity-80 transition-opacity">
                <img
                  src={theme === 'dark' ? darkLogo : lightLogo}
                  alt="MGMS Logo"
                  className="h-12 md:h-14 w-auto"
                />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight tracking-tight"
            >
              <span className="text-slate-900 dark:text-white">A Smarter Way to</span>
              <br />
              <span className="bg-gradient-to-r from-luxury-indigo to-luxury-teal dark:from-luxury-glow dark:to-luxury-cyan bg-clip-text text-transparent">
                Manage and Share
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">Your Media</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Professional media management made simple. Secure, fast, and
              designed for teams who demand excellence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register">
                <Button variant="primary" size="lg" className="group">
                  Get Started
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Login
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass rounded-3xl p-8 hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-indigo/20 to-luxury-teal/20 dark:from-luxury-glow/20 dark:to-luxury-cyan/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-luxury-indigo dark:text-luxury-glow" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-strong rounded-3xl p-12 md:p-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 dark:text-white">
              Experience the Difference
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join professionals who trust MGMS for their media management
              needs.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="group">
                Start Your Journey
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/70 dark:border-white/10 py-12 px-6 lg:px-8 mt-20 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-gray-400 text-sm">
              Creation by{' '}
              <span className="text-luxury-indigo dark:text-luxury-glow font-medium">
                Dehan Nimna Sandadiya
              </span>
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/DehanNimnaSandadiya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-gray-400 hover:text-luxury-indigo dark:hover:text-luxury-glow transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/dehannimnasandadiya/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-gray-400 hover:text-luxury-indigo dark:hover:text-luxury-glow transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

