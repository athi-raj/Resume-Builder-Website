
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;
  
  return (
    <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2 text-sm">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;
