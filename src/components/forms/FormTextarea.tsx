'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  icon?: string;
  required?: boolean;
  className?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  icon,
  required = false,
  className = ''
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white/90 mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <motion.textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        whileFocus={{ 
          scale: 1.01,
          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)"
        }}
        className="
          w-full px-4 py-3 
          bg-white/10 backdrop-blur-sm 
          border-2 border-white/20 
          rounded-xl 
          text-white placeholder-white/50 
          focus:border-purple-400 focus:bg-white/15
          focus:outline-none 
          transition-all duration-200
          shadow-lg
          resize-none
        "
      />
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
