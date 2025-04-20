import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/auth/AuthLayout';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';

const SignUp = () => {
  const { signup, isAuthenticated, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  const navigate = useNavigate();

  // If already authenticated and not loading, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      toast({
        title: "Success",
        description: "Please check your email for verification code.",
      });
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <AuthLayout mode="signup">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d2b4e] mx-auto mb-4"></div>
            <p className="text-[#4a4869]">Setting up your account...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout mode="signup">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#2d2b4e]">
            Create Account
          </h1>
          <p className="text-[#4a4869] text-sm">
            Enter your details below
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="h-12 rounded-lg border-[#e8f3ff] focus:border-[#2d2b4e] focus:ring-[#2d2b4e]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
            required
            disabled={isLoading}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 rounded-lg border-[#e8f3ff] focus:border-[#2d2b4e] focus:ring-[#2d2b4e]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-12 rounded-lg border-[#e8f3ff] focus:border-[#2d2b4e] focus:ring-[#2d2b4e]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
            required
            disabled={isLoading}
          />

          <label className="flex items-center gap-2">
            <input 
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="rounded border-[#e8f3ff] text-[#2d2b4e] focus:ring-[#2d2b4e]/20"
              disabled={isLoading}
            />
            <span className="text-sm text-[#4a4869]">
              I agree to the{' '}
              <Link to="/terms" className="text-[#2d2b4e] hover:text-[#6366f1]">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-[#2d2b4e] hover:text-[#6366f1]">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-lg bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </Button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8f3ff]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-4 bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff] text-[#4a4869]">Or sign up with</span>
          </div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          className="w-full h-12 rounded-lg border-[#e8f3ff] hover:bg-[#f8f2ff] text-[#2d2b4e] font-medium"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Google signup will be available soon!",
            });
          }}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
