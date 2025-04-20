import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResumeTemplateCard from '@/components/resume/ResumeTemplateCard';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import useResumeStore, { ResumeTemplate } from '@/hooks/useResumeStore';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

// Template data
const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with perfect balance of white space.',
    image: 'https://img.freepik.com/free-vector/retro-scandinavian-style-geometric-line-art-design_1048-20387.jpg?t=st=1742492942~exp=1742496542~hmac=cc07a1f5881ffe28b6eb96945457dd1a02771394868036cc9eccaa8b7d54ab70&w=740',
    category: 'professional'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a touch of color and stylish elements.',
    image: 'https://img.freepik.com/free-vector/light-gray-geometrical-shape-decorated-banner_53876-177780.jpg?t=st=1742493206~exp=1742496806~hmac=d40de0089a8b8b7057b33ba13042637b53d4c1bd62cfab648e0ae77cd6edea79&w=740',
    category: 'creative'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional design perfect for conservative industries.',
    image: 'https://img.freepik.com/free-photo/clear-pattern-glass-product-backdrop_53876-132994.jpg?t=st=1742492703~exp=1742496303~hmac=4181055ff39880f2532e7f7a1706b1918c76ac37870fa1c2d1e0caf751f21ab1&w=740',
    category: 'professional'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout ideal for senior positions.',
    image: 'https://img.freepik.com/free-photo/creative-wallpaper-with-white-shapes_23-2148811498.jpg?t=st=1742493711~exp=1742497311~hmac=e04b7688ee15bc65a122950123edd2e9d4a7da677b5a2f76972568186ae711c0&w=1380',
    category: 'professional'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals and designers.',
    image: 'https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378304.jpg?t=st=1742493778~exp=1742497378~hmac=1c016ea72f09fc956169e9c622433488eca86cbb260a7e5e2f79386c75d015dc&w=1380',
    category: 'creative'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern layout with a technical feel for IT professionals.',
    image: 'https://img.freepik.com/free-photo/3d-abstract-background-with-plexus-design_1048-18504.jpg?t=st=1742493908~exp=1742497508~hmac=03829415d28328135a974c55d3360b05382988145140e4907670bd681b8aa700&w=1060',
    category: 'technical'
  }
];

const Templates = () => {
  const navigate = useNavigate();
  const { currentResumeData, setTemplateId, setCurrentResumeTemplate } = useResumeStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    currentResumeData?.templateId || 'minimal'
  );
  const [filter, setFilter] = useState<string | null>(null);
  
  // Redirect if no resume is selected
  useEffect(() => {
    if (!currentResumeData) {
      navigate('/dashboard');
      toast({
        title: "No Resume Selected",
        description: "Please select a resume from the dashboard first.",
        variant: "destructive"
      });
    }
  }, [currentResumeData, navigate]);

  // Ensure template is set in the store when component mounts
  useEffect(() => {
    if (currentResumeData && selectedTemplate) {
      console.log('Setting initial template:', selectedTemplate);
      setTemplateId(selectedTemplate);
      setCurrentResumeTemplate(selectedTemplate as ResumeTemplate);
    }
  }, []);

  if (!currentResumeData) {
    return null;
  }
  
  const filteredTemplates = filter 
    ? templates.filter(template => template.category === filter)
    : templates;
  
  // This function now updates both the local state and the global store
  const handleSelectTemplate = async (id: string) => {
    try {
      setSelectedTemplate(id);
      
      // Create a new resume if none exists
      if (!currentResumeData) {
        console.log('No resume data, creating new resume...');
        navigate('/dashboard');
        return;
      }
      
      // Update both the templateId in the resume data and the current template
      setTemplateId(id);
      setCurrentResumeTemplate(id as ResumeTemplate);
      
      // Log for debugging
      console.log(`Template selected: ${id}`);
      console.log('Current resume data:', currentResumeData);
      
      toast({
        title: "Template Selected",
        description: `The ${templates.find(t => t.id === id)?.name} template has been applied.`,
      });
    } catch (error) {
      console.error('Error selecting template:', error);
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Initialize with current template on mount
  useEffect(() => {
    if (currentResumeData?.templateId) {
      setSelectedTemplate(currentResumeData.templateId);
      setCurrentResumeTemplate(currentResumeData.templateId as ResumeTemplate);
    }
  }, [currentResumeData?.templateId, setCurrentResumeTemplate]);
  
  const handleContinue = async () => {
    try {
      if (!selectedTemplate || !currentResumeData) {
        toast({
          title: "Error",
          description: "Please select a template and ensure you have a resume created.",
          variant: "destructive"
        });
        return;
      }
      
      // Ensure the template is set in the store before navigating
      setTemplateId(selectedTemplate);
      setCurrentResumeTemplate(selectedTemplate as ResumeTemplate);
      
      // Log for debugging
      console.log(`Continuing to preview with template: ${selectedTemplate}`);
      
      navigate('/preview');
    } catch (error) {
      console.error('Error continuing to preview:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
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
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-3xl font-bold text-[#2d2b4e] mb-4">Choose Your Template</h1>
          <p className="text-[#4a4869]">
            Select from our collection of professionally designed and ATS-friendly templates.
            Each template is optimized for readability and impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
            >
              <Card 
                className={`relative overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-[#6366f1] ring-2 ring-[#6366f1]/20' 
                    : 'border-[#e8f3ff] hover:border-[#6366f1]/50'
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedTemplate === template.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 h-8 w-8 bg-[#6366f1] text-white rounded-full flex items-center justify-center"
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h3 className="font-medium text-lg">{template.name}</h3>
                      <p className="text-sm text-white/80">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white min-w-[200px]"
          >
            Continue to Editor
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Templates;
