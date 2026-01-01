import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'font-display font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-luxury-glow/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  const variants = {
    primary:
      'bg-gradient-to-r from-luxury-indigo to-luxury-teal text-white hover:shadow-lg hover:shadow-luxury-indigo/30 dark:hover:shadow-glow dark:hover:shadow-luxury-glow/50 active:scale-[0.98] border border-luxury-indigo/30 dark:border-luxury-glow/30',
    secondary:
      'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-100 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 active:scale-[0.98] shadow-sm dark:shadow-none',
    ghost:
      'bg-transparent text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-[0.98]',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] border border-red-400/30',
    outline:
      'border-2 border-luxury-indigo/50 dark:border-luxury-glow/50 text-luxury-indigo dark:text-luxury-glow hover:bg-luxury-indigo/10 dark:hover:bg-luxury-glow/10 hover:shadow-md dark:hover:shadow-glow active:scale-[0.98]',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-luxury-glow/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default Button;

