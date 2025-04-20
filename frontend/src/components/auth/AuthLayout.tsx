import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'signup' | 'verify';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Colored Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block w-1/2 relative bg-gradient-to-br from-[#2d2b4e] to-[#4a4869]"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#ffd700] rounded-full blur-[100px] opacity-20" />
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-[#e8f3ff] rounded-full blur-[100px] opacity-20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-md text-center"
          >
            <img 
              src="https://img.freepik.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg?t=st=1743287409~exp=1743291009~hmac=1cbb69f9066855baa2d4143f501e52a68410baf728735d22dddf1952b65daf75&w=826" 
              alt="Authentication illustration" 
              className="w-full h-auto mx-auto mb-8 rounded-2xl shadow-2xl bg-white/10 p-4"
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl font-bold mb-4 text-white"
            >
              {mode === 'login' ? 'Welcome Back!' : mode === 'verify' ? 'Verify Your Email' : 'Join Our Community'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/80"
            >
              {mode === 'login' 
                ? 'Sign in to access your account and continue building your professional resume.'
                : mode === 'verify'
                ? 'Please verify your email address to complete your registration.'
                : 'Create an account to start building your professional resume and advance your career.'}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex flex-col min-h-screen bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff]"
      >
        {/* Logo */}
        <div className="p-8">
          <Link to="/" className="block">
            <img 
              src="/favicon.ico" 
              alt="" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center text-sm text-[#4a4869]">
          {mode === 'login' ? (
            <p>Not a member? <Link to="/signup" className="text-[#2d2b4e] hover:text-[#6366f1] font-medium">Join us</Link></p>
          ) : mode === 'verify' ? (
            <p>Having trouble? <Link to="/signup" className="text-[#2d2b4e] hover:text-[#6366f1] font-medium">Start over</Link></p>
          ) : (
            <p>Already a member? <Link to="/login" className="text-[#2d2b4e] hover:text-[#6366f1] font-medium">Sign in</Link></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
