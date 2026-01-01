import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  title,
  footer,
  variant = 'solid',
  hover = true,
  ...props
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-300';
  const variants = {
    solid: 'bg-white dark:bg-white/5 border border-slate-200/70 dark:border-white/20 shadow-sm dark:shadow-none',
    glass: 'bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/25 shadow-md dark:shadow-none backdrop-blur-xl',
    solidDark: 'bg-slate-50 dark:bg-luxury-dark/80 border border-slate-200 dark:border-white/15',
  };

  const hoverClasses = hover
    ? 'hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30 hover:shadow-md dark:hover:shadow-luxury'
    : '';

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-5 border-b border-slate-200/70 dark:border-white/20">
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-5 border-t border-slate-200/70 dark:border-white/20 bg-slate-50 dark:bg-white/5 rounded-b-3xl">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;

