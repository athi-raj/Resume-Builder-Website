import React from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose a template',
      description: 'Select from our collection of professionally designed and ATS-friendly templates.'
    },
    {
      step: '02',
      title: 'Fill in your details',
      description: 'Enter your personal information, work experience, education, and skills.'
    },
    {
      step: '03',
      title: 'Download and share',
      description: 'Export your resume as PDF, Word, or HTML and start applying for jobs immediately.'
    }
  ];

  return (
    <section className="py-20 bg-[#f8f2ff] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-0 w-72 h-72 bg-[#e8f3ff] rounded-full opacity-50" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-[#ffd700] rounded-full opacity-10" />
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
            How It Works
          </h2>
          <p className="text-xl text-[#4a4869] max-w-2xl mx-auto">
            Creating a professional resume is quick and easy with our intuitive builder.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#2d2b4e] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#2d2b4e]">{item.title}</h3>
              <p className="text-[#4a4869]">{item.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 w-1/4 h-0.5 bg-[#e8f3ff]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
