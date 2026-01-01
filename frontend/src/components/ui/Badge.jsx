const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const variants = {
    default: 'glass text-gray-300 border border-white/10',
    primary:
      'bg-gradient-to-r from-luxury-glow/20 to-luxury-cyan/20 text-luxury-glow border border-luxury-glow/30',
    success:
      'bg-green-500/20 text-green-400 border border-green-500/30',
    danger:
      'bg-red-500/20 text-red-400 border border-red-500/30',
    warning:
      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  };
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

