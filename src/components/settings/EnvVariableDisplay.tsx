import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';

interface EnvVariableDisplayProps {
  name: string;
  value?: string;
  placeholder?: string;
  isSensitive?: boolean;
  onChange?: (newValue: string) => void;
}

export const EnvVariableDisplay: React.FC<EnvVariableDisplayProps> = ({
  name,
  value,
  placeholder = '',
  isSensitive = false,
  onChange,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    isSensitive ? placeholder : value ?? ''
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(placeholder);
      // optionally show toast
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="sr-only" htmlFor={name}>
        {name}
      </label>
      <Input
        id={name}
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        type={isSensitive ? 'password' : 'text'}
        className="flex-1"
        disabled={isSensitive}
      />
      <Button type="button" onClick={handleCopy} variant="outline">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EnvVariableDisplay;