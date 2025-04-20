import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import useResumeStore from '@/hooks/useResumeStore';
import { toast } from '@/components/ui/use-toast';
import { PersonalInfoForm, EducationForm, ExperienceForm, SkillsForm, ProjectsCertificationsForm } from '@/components/resume/ResumeForm';
import FormStepIndicator from '@/components/resume/FormStepIndicator';

const Builder = () => {
  const navigate = useNavigate();
  const { currentResumeId, saveResume } = useResumeStore();
  const [autoSaveIndicator, setAutoSaveIndicator] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  
  // Auto-save indicator and functionality
  useEffect(() => {
    const showSavedIndicator = async () => {
      setAutoSaveIndicator('Saving...');
      try {
        await saveResume();
        setAutoSaveIndicator('All changes saved');
      } catch (error) {
        setAutoSaveIndicator('Failed to save');
        console.error('Auto-save failed:', error);
      }
    };
    
    // Show indicator whenever the form likely changes
    showSavedIndicator();
    
    // Set up an interval to periodically save
    const intervalId = setInterval(showSavedIndicator, 30000);
    
    return () => clearInterval(intervalId);
  }, [saveResume]);
  
  // Check if resume exists
  useEffect(() => {
    if (!currentResumeId) {
      toast({
        title: "No resume selected",
        description: "Please create or select a resume first.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [currentResumeId, navigate]);
  
  const handleContinueToTemplates = () => {
    navigate('/templates');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff]">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-[#2d2b4e]">Build Your Resume</h1>
              <p className="text-[#4a4869] mt-1">
                Fill in your details to create a professional resume
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {autoSaveIndicator && (
                <span className={`text-sm ${
                  autoSaveIndicator === 'Failed to save' 
                    ? 'text-red-500' 
                    : autoSaveIndicator === 'Saving...' 
                    ? 'text-[#4a4869]' 
                    : 'text-green-600'
                } animate-fade-in`}>
                  {autoSaveIndicator}
                </span>
              )}
              
              <Button 
                onClick={handleContinueToTemplates}
                className="rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white"
              >
                Continue to Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
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
              className="max-w-4xl mx-auto"
            >
              <FormStepIndicator 
                currentStep={currentStep} 
                totalSteps={totalSteps}
              />
              
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8 space-y-8"
              >
                {currentStep === 0 && <PersonalInfoForm />}
                {currentStep === 1 && <EducationForm />}
                {currentStep === 2 && <ExperienceForm />}
                {currentStep === 3 && <SkillsForm />}
                {currentStep === 4 && <ProjectsCertificationsForm />}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-between mt-8"
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep === totalSteps - 1 ? (
                  <Button
                    onClick={handleContinueToTemplates}
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  >
                    Continue to Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Builder;
