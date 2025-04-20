import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only show toast if not authenticated and not in the process of checking auth
    if (!isAuthenticated && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    // Add a delay before redirecting to ensure state is updated
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  // If still checking auth status, show loading spinner
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated and should redirect, go to login
  if (!isAuthenticated && shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
