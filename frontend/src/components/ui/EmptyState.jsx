import { AlertCircle, Image as ImageIcon } from 'lucide-react';

const EmptyState = ({
  icon: Icon = ImageIcon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;


