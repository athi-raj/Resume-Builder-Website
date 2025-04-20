import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/auth/AuthLayout';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout mode="login">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#2d2b4e]">
            Welcome Back
          </h1>
          <p className="text-[#4a4869] text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 rounded-lg border-[#e8f3ff] focus:border-[#2d2b4e] focus:ring-[#2d2b4e]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-12 rounded-lg border-[#e8f3ff] focus:border-[#2d2b4e] focus:ring-[#2d2b4e]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox"
              className="rounded border-[#e8f3ff] text-[#2d2b4e] focus:ring-[#2d2b4e]/20"
            />
            <span className="text-sm text-[#4a4869]">Remember me</span>
          </label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-[#2d2b4e] hover:text-[#6366f1]"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-lg bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white font-medium transition-colors"
          >
            LOGIN
          </Button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8f3ff]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-4 bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff] text-[#4a4869]">Or login with</span>
          </div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          className="w-full h-12 rounded-lg border-[#e8f3ff] hover:bg-[#f8f2ff] text-[#2d2b4e] font-medium"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Google login will be available soon!",
            });
          }}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;

