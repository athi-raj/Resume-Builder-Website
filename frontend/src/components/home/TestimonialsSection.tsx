import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "This resume builder helped me land interviews at top tech companies. The templates are professional and modern.",
      author: "Alex Johnson",
      role: "Software Engineer"
    },
    {
      quote: "I was struggling with my resume format until I found this tool. Clean interface and lots of helpful features!",
      author: "Sarah Chen",
      role: "Marketing Specialist"
    },
    {
      quote: "Creating an ATS-friendly resume has never been easier. I recommend this to all my colleagues.",
      author: "Michael Rivera",
      role: "Project Manager"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 w-96 h-96 bg-[#f8f2ff] rounded-full opacity-50 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#e8f3ff] rounded-full opacity-50 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ffd700] rounded-full opacity-10 blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d2b4e]">
            What Our Users Say
          </h2>
          <p className="text-xl text-[#4a4869] max-w-2xl mx-auto">
            Join thousands of job seekers who have created successful resumes with our platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#e8f3ff] hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-1 text-[#ffd700] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="italic text-[#4a4869] mb-6 group-hover:text-[#2d2b4e] transition-colors">"{testimonial.quote}"</p>
              <div>
                <p className="font-medium text-[#2d2b4e]">{testimonial.author}</p>
                <p className="text-sm text-[#4a4869]">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
