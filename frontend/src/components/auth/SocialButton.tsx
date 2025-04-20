
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface SocialButtonProps {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}

const SocialButton = ({ onClick, icon, children }: SocialButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 py-6 border border-border/50"
    >
      {icon}
      {children}
    </Button>
  );
};

export default SocialButton;
