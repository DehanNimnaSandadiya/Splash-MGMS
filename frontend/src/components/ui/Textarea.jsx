const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-luxury-glow/50 focus:border-cyan-500/40 dark:focus:border-luxury-glow/50 transition-all duration-300 ${
          error
            ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-500/10'
            : 'border-slate-300 dark:border-white/25 bg-white dark:bg-white/5'
        } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Textarea;

