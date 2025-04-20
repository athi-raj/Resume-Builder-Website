import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationCode } = useAuthStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      await verifyEmail(code);
      toast({
        title: "Success",
        description: "Email verified successfully. You can now log in.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || countdown > 0) return;

    setIsResending(true);
    try {
      await resendVerificationCode(email);
      toast({
        title: "Success",
        description: "Verification code resent. Please check your email.",
      });
      setCountdown(60);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff] py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-16 w-16 rounded-full bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="h-8 w-8" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl font-bold text-[#2d2b4e] mb-4"
            >
              Verify Your Email
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[#4a4869]"
            >
              We've sent a verification code to {email}. Please enter it below to verify your email address.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#e8f3ff]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-[#2d2b4e] mb-2">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="w-full"
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#4a4869]">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendCode}
                  disabled={isResending || countdown > 0}
                  className="text-[#6366f1] hover:text-[#4f46e5] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending
                    ? 'Sending...'
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : 'Resend Code'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 