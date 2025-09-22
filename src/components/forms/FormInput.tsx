'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

// Omit the standard 'onChange' and 'type' from HTMLInputElement
// as we'll be using our custom versions
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'>;

interface FormInputProps extends InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'month' | 'number';
  icon?: string;
  required?: boolean;
  className?: string;
  inputType?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'month' | 'number';
  disabled?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  value,
  onChange,
  placeholder,
  type: propType = 'text',
  icon,
  required = false,
  className = '',
  inputType,
  disabled = false,
  ...props
}, ref) => {
  // Use inputType if provided, otherwise fall back to type
  const inputTypeToUse = inputType || propType;
  
  // Handle the change event and call our custom onChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white/90 mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <motion.input
        ref={ref}
        type={inputTypeToUse}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        whileFocus={disabled ? {} : { 
          scale: 1.01,
          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)"
        }}
        className={`
          w-full px-4 py-3 
          bg-white/10 backdrop-blur-sm 
          border-2 ${disabled ? 'border-white/10' : 'border-white/20'}
          rounded-xl 
          text-white placeholder-white/50 
          ${disabled ? 'opacity-70 cursor-not-allowed' : 'focus:border-purple-400 focus:bg-white/15'}
          focus:outline-none 
          transition-all duration-200
          shadow-lg
          ${disabled ? '' : 'hover:border-white/30'}
        `}
        // Only spread non-undefined props to avoid overriding our custom props
        {...(props as any)}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
