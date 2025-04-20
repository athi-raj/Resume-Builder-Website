
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  text: string;
}

const SubmitButton = ({
  isLoading,
  loadingText,
  text
}: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full py-6 bg-primary hover:bg-primary/90" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : text}
    </Button>
  );
};

export default SubmitButton;
