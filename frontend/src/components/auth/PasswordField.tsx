
import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import InputField from './InputField';
import { Link } from 'react-router-dom';

interface PasswordFieldProps {
  id: string;
  label: string;
  showForgotPassword?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PasswordField = ({
  id,
  label,
  showForgotPassword = false,
  value,
  onChange,
  disabled
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {showForgotPassword && (
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        )}
      </div>
      
      <InputField
        id={id}
        label=""
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        disabled={disabled}
        icon={LockKeyhole}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        }
      />
    </div>
  );
};

export default PasswordField;
