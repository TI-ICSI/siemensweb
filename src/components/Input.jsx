// src/components/common/Input.jsx - Versión Tailwind
const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  error, 
  required,
  icon 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-icsi-titleform mb-2">
          {label} {required && <span className="text-icsi-primary">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;