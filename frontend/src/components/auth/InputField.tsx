
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  icon: LucideIcon;
  rightElement?: React.ReactNode;
}

const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  icon: Icon,
  rightElement
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input 
          id={id} 
          type={type} 
          placeholder={placeholder} 
          className={`pl-10 ${rightElement ? 'pr-10' : ''} py-5 bg-secondary/10 border-secondary/30`}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {rightElement && (
          <div className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
