import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <section className="relative bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff] text-[#2d2b4e] min-h-[90vh] py-20 overflow-hidden">
      {/* Geometric shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute right-20 top-40 w-96 h-96 bg-[#e8f3ff] rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute right-60 top-20 w-20 h-20 bg-[#ffd700] rounded-full opacity-80"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute right-40 bottom-40 w-32 h-32 bg-[#2d2b4e] rounded-lg transform rotate-45 opacity-10"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#6b7280] font-medium tracking-wider uppercase text-sm"
              >
                Welcome to Resume Builder
              </motion.h2>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold !leading-tight"
              >
                Create Professional Resumes in Minutes
              </motion.h1>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-[#4a4869] max-w-lg leading-relaxed"
            >
              Design your perfect resume with our easy-to-use builder. Stand out to employers and land your dream job with a professionally crafted resume.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/builder">
                    Create Your Resume
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-[#2d2b4e] hover:bg-[#3d3b5e] text-white rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-[#2d2b4e] text-[#2d2b4e] rounded-xl px-8 hover:bg-[#2d2b4e]/5 transition-all duration-300">
                    <Link to="/login">
                      <LogIn className="mr-2 h-5 w-5" />
                      Log In
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://imgs.search.brave.com/3C1zAheUh1JtgfqURwMbBCFH2ZNGvN7GKkl-Lc5kocI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saDct/cnQuZ29vZ2xldXNl/cmNvbnRlbnQuY29t/L2RvY3N6L0FEXzRu/WGVPNl9KRzdyNEpl/NmpBZ1lfMWMweTl4/TWJkaXFyTDZVQ1lB/NVFmbDFVOHFBOXMz/SFJ1QnZTWmFmWHMx/WU83Rzd5dXZRYnE5/U3ZWQzRHR2N4OVhD/UTFMdm1ZaHpiT0s3/SUxyOHh4RklRbnFz/cl9BZElJSHlwek5k/RkN5bU1ab0hDRGtQ/cWJUP2tleT1UODFJ/d2d5QUVfcDFrR0ZK/cnRiaHl4cFU"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d2b4e]/20 via-transparent to-white/40" />
            </div>
            <motion.div 
              initial={{ x: 20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#ffd700] rounded-2xl transform rotate-12"
            />
            <motion.div 
              initial={{ x: -20, y: -20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="absolute -top-5 -left-5 w-16 h-16 bg-[#e8f3ff] rounded-full border-4 border-white shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
