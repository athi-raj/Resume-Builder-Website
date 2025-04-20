import React from 'react';
import { FileText, Laptop, ZapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'ATS-Friendly Templates',
      description: 'Our resume templates are designed to pass through Applicant Tracking Systems with ease.'
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: 'Multiple Export Options',
      description: 'Export your resume as PDF, Word, or HTML to match any application requirements.'
    },
    {
      icon: <ZapIcon className="h-6 w-6" />,
      title: 'Auto-Save Feature',
      description: 'Never lose your progress with our automatic saving functionality.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#f8f2ff] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-40 w-96 h-96 bg-[#e8f3ff] rounded-full opacity-50" />
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-[#ffd700] rounded-full opacity-10" />
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
            Everything You Need for Your Resume
          </h2>
          <p className="text-xl text-[#4a4869] max-w-2xl mx-auto">
            Our resume builder provides all the tools you need to create a standout resume.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8f3ff] hover:shadow-xl transition-all group"
            >
              <div className="h-14 w-14 rounded-xl bg-[#2d2b4e]/5 text-[#2d2b4e] flex items-center justify-center mb-6 group-hover:bg-[#2d2b4e] group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#2d2b4e]">
                {feature.title}
              </h3>
              <p className="text-[#4a4869]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
