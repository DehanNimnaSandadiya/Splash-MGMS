const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default:
      'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl',
    text: 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded h-4',
    image:
      'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl aspect-square',
    card: 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl',
  };

  return <div className={`${variants[variant]} ${className}`} />;
};

export default Skeleton;

