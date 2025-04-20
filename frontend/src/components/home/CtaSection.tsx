import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';
import { motion } from 'framer-motion';

const CtaSection = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#f8f2ff]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#2d2b4e] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d2b4e] via-[#2d2b4e]/95 to-[#2d2b4e]/90"></div>
            {/* Decorative elements */}
            <div className="absolute -right-20 top-0 w-72 h-72 bg-[#ffd700] rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -left-20 bottom-0 w-72 h-72 bg-[#e8f3ff] rounded-full opacity-10 blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
            >
              Ready to Create Your Professional Resume?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/90 max-w-2xl mx-auto mb-10 text-lg"
            >
              Join thousands of job seekers who have created successful resumes with our platform.
              Start building your career today!
            </motion.p>
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="rounded-xl px-8 bg-white hover:bg-white/90 text-[#2d2b4e] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/builder">
                    Create Your Resume Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="rounded-xl px-8 bg-white hover:bg-white/90 text-[#2d2b4e] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/signup">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl px-8 bg-transparent text-white border-white hover:bg-white/10 transition-all duration-300"
                >
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
