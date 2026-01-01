const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  className = '',
  required = false,
  placeholder = 'Select...',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-luxury-glow/50 focus:border-cyan-500/40 dark:focus:border-luxury-glow/50 transition-all duration-300 ${
          error
            ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-500/10'
            : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5'
        } text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/10 ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white dark:bg-gray-800"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;

