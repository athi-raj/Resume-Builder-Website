
import React from 'react';

interface AuthDividerProps {
  text?: string;
}

const AuthDivider = ({ text = "Or continue with" }: AuthDividerProps) => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;
