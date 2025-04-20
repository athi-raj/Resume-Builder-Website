import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Download, FileText, Mail, MapPin, Phone, LayoutList } from 'lucide-react';
import useResumeStore from '@/hooks/useResumeStore';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DraggableResumeSection, { ResumeSectionType } from '@/components/resume/DraggableResumeSection';
import SavedTemplates from '@/components/resume/SavedTemplates';
import type { Resume, ResumeTemplate } from '@/hooks/useResumeStore';

const renderSection = (sectionType: ResumeSectionType, resumeData: Resume, templateStyle: string) => {
  switch (sectionType) {
    case 'personalInfo':
      return null;
    case 'summary':
      if (!resumeData.personalInfo?.summary) return null;
      return (
        <div className="mb-6">
          <h2 className={`text-lg font-bold uppercase ${templateStyle === 'classic' ? 'font-serif border-b-2 border-gray-400' : 'border-b border-gray-300'} pb-1 mb-2`}>
            {templateStyle === 'creative' ? 'ABOUT ME' : 'PROFESSIONAL SUMMARY'}
          </h2>
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      );
    case 'experience':
      if (!resumeData.experience?.length) return null;
      return (
        <div className="mb-6">
          <h2 className={`text-lg font-bold uppercase ${templateStyle === 'classic' ? 'font-serif border-b-2 border-gray-400' : 'border-b border-gray-300'} pb-1 mb-2`}>
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="text-md font-bold">{exp.position}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{exp.company}, {exp.location}</p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'education':
      if (!resumeData.education?.length) return null;
      return (
        <div className="mb-6">
          <h2 className={`text-lg font-bold uppercase ${templateStyle === 'classic' ? 'font-serif border-b-2 border-gray-400' : 'border-b border-gray-300'} pb-1 mb-2`}>
            EDUCATION
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="text-md font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} – {edu.endDate}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    case 'skills':
      if (!resumeData.skills?.length) return null;
      return (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {resumeData.skills.map((skill) => (
              <span 
                key={skill.id}
                className="bg-gray-100 px-2.5 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      );
    case 'projects':
      if (!resumeData.projects?.length) return null;
      return (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-md font-bold">{project.name}</h3>
                <p className="text-sm mt-1">{project.description}</p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case 'certifications':
      if (!resumeData.certifications?.length) return null;
      return (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Certifications
          </h2>
          <div className="space-y-2">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="text-md font-bold">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

const MinimalTemplate = () => {
  const { currentResumeData, currentSectionOrder } = useResumeStore();
  
  if (!currentResumeData) {
    return (
      <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
        <div className="text-center">
          <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo } = currentResumeData;
  
  return (
    <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{personalInfo.title}</p>
        
        <div className="flex justify-center gap-4 mt-3 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {personalInfo.city}
                {personalInfo.city && personalInfo.state && ', '}
                {personalInfo.state}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {currentSectionOrder
        .filter(section => section !== 'personalInfo')
        .map((section) => renderSection(section, currentResumeData, 'minimal'))
      }
    </div>
  );
};

const ModernTemplate = () => {
  const { currentResumeData, currentSectionOrder } = useResumeStore();
  
  if (!currentResumeData) {
    return (
      <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
        <div className="text-center">
          <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo } = currentResumeData;
  
  return (
    <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto text-black">
      <div className="bg-primary text-white p-8">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg opacity-90 mt-1">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {personalInfo.city}
                {personalInfo.city && personalInfo.state && ', '}
                {personalInfo.state}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8">
        {currentSectionOrder
          .filter(section => section !== 'personalInfo')
          .map((section) => renderSection(section, currentResumeData, 'modern'))
        }
      </div>
    </div>
  );
};

const ClassicTemplate = () => {
  const { currentResumeData } = useResumeStore();
  
  const sectionHeaderStyle = {
    color: '#2d2b4e',
    fontSize: '1.5rem',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e8f3ff',
    paddingBottom: '0.5rem',
    marginBottom: '1.25rem',
    fontFamily: 'inherit'
  };

  return (
    <div className="max-w-[850px] mx-auto p-8 bg-white shadow-lg">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentResumeData?.personalInfo.firstName} {currentResumeData?.personalInfo.lastName}
        </h1>
        {currentResumeData?.personalInfo.title && (
          <p className="text-xl text-gray-600 mt-2">{currentResumeData.personalInfo.title}</p>
        )}
        <div className="text-gray-600 mt-2">
          {currentResumeData?.personalInfo.email && (
            <span className="mr-4">{currentResumeData.personalInfo.email}</span>
          )}
          {currentResumeData?.personalInfo.phone && (
            <span>{currentResumeData.personalInfo.phone}</span>
          )}
        </div>
        {currentResumeData?.personalInfo.address && (
          <p className="text-gray-600 mt-1">
            {currentResumeData.personalInfo.address}
            {currentResumeData.personalInfo.city && `, ${currentResumeData.personalInfo.city}`}
            {currentResumeData.personalInfo.state && `, ${currentResumeData.personalInfo.state}`}
            {currentResumeData.personalInfo.zip && ` ${currentResumeData.personalInfo.zip}`}
          </p>
        )}
      </div>

      {/* Summary Section */}
      {currentResumeData?.personalInfo.summary && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Professional Summary</h2>
          <p className="text-gray-700 whitespace-pre-line">{currentResumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {currentResumeData?.experience && currentResumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Experience</h2>
          <div className="space-y-6">
            {currentResumeData.experience.map((exp) => (
              <div key={exp.id}>
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                <p className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {currentResumeData?.education && currentResumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Education</h2>
          <div className="space-y-6">
            {currentResumeData.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-lg font-semibold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700">{edu.institution}</p>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate}
                  </p>
                )}
                {edu.description && (
                  <p className="text-gray-700 mt-2 whitespace-pre-line">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {currentResumeData?.skills && currentResumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Skills</h2>
          <div className="flex flex-wrap gap-4">
            {currentResumeData.skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <span className="text-gray-700">{skill.name}</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-4 rounded-full ${
                        i < skill.level ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {currentResumeData?.projects && currentResumeData.projects.length > 0 && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Projects</h2>
          <div className="space-y-6">
            {currentResumeData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mt-1">{project.description}</p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-1 inline-block"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {currentResumeData?.certifications && currentResumeData.certifications.length > 0 && (
        <div className="mb-8">
          <h2 style={sectionHeaderStyle}>Certifications</h2>
          <div className="space-y-6">
            {currentResumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
                {cert.date && (
                  <p className="text-gray-600 text-sm">{cert.date}</p>
                )}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-1 inline-block"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExecutiveTemplate = () => {
  const { currentResumeData, currentSectionOrder } = useResumeStore();
  
  if (!currentResumeData) {
    return (
      <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
        <div className="text-center">
          <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo } = currentResumeData;
  
  return (
    <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto text-black">
      <div className="bg-gray-800 text-white p-8">
        <h1 className="text-3xl font-bold tracking-wide border-b-2 border-white pb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg opacity-90 mt-2">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Mail className="h-3.5 w-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Phone className="h-3.5 w-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {personalInfo.city}
                {personalInfo.city && personalInfo.state && ', '}
                {personalInfo.state}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8">
        {currentSectionOrder
          .filter(section => section !== 'personalInfo')
          .map((section) => renderSection(section, currentResumeData, 'executive'))
        }
      </div>
    </div>
  );
};

const CreativeTemplate = () => {
  const { currentResumeData, currentSectionOrder } = useResumeStore();
  
  if (!currentResumeData) {
    return (
      <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
        <div className="text-center">
          <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo } = currentResumeData;
  
  return (
    <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto text-black overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-8">
        <h1 className="text-4xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl mt-2">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Mail className="h-3.5 w-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Phone className="h-3.5 w-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {personalInfo.city}
                {personalInfo.city && personalInfo.state && ', '}
                {personalInfo.state}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8">
        {currentSectionOrder
          .filter(section => section !== 'personalInfo')
          .map((section) => renderSection(section, currentResumeData, 'creative'))
        }
      </div>
    </div>
  );
};

const TechTemplate = () => {
  const { currentResumeData, currentSectionOrder } = useResumeStore();
  
  if (!currentResumeData) {
    return (
      <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
        <div className="text-center">
          <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo } = currentResumeData;
  
  return (
    <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto text-black overflow-hidden">
      <div className="bg-gray-900 text-white p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-mono font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-lg text-blue-400 font-mono mt-1">{personalInfo.title}</p>
          </div>
          
          <div className="flex flex-col gap-2 mt-4 md:mt-0">
            {personalInfo.email && (
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded font-mono text-sm">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded font-mono text-sm">
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.state) && (
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded font-mono text-sm">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  {personalInfo.city}
                  {personalInfo.city && personalInfo.state && ', '}
                  {personalInfo.state}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-8">
        {currentSectionOrder
          .filter(section => section !== 'personalInfo')
          .map((section) => renderSection(section, currentResumeData, 'tech'))
        }
      </div>
    </div>
  );
};

const Preview = () => {
  const navigate = useNavigate();
  const { 
    currentResumeData, 
    currentResumeTemplate, 
    setCurrentResumeTemplate,
    currentSectionOrder,
    setSectionOrder
  } = useResumeStore();
  
  const [activeTab, setActiveTab] = useState<string>('preview');
  const resumeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentResumeData) {
      toast({
        title: "No Resume Selected",
        description: "Please select a resume from the dashboard first.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [currentResumeData, navigate]);
  
  const handleDownloadHTML = async () => {
    if (!resumeRef.current) return;

    toast({
      title: "Generating HTML",
      description: "Please wait while we prepare your resume...",
    });

    try {
      const htmlContent = resumeRef.current.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "HTML Downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your HTML file.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    if (!resumeRef.current) return;

    toast({
      title: "Generating Word Document",
      description: "Please wait while we prepare your resume...",
    });

    try {
      const htmlContent = resumeRef.current.outerHTML;
      // Add Word-specific styling
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      const blob = new Blob([wordHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Word Document Downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your Word document.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your resume...",
    });

    try {
      // Create a clone of the resume element for PDF generation
      const clone = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.background = 'white';
      container.style.width = '800px'; // Fixed width for consistent rendering
      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: clone.offsetHeight
      });
      
      // Clean up
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      
      // A4 size in mm (210 x 297)
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit content on the page with margins
      const margin = 10; // 10mm margins
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);
      
      const aspectRatio = canvas.width / canvas.height;
      let finalWidth = availableWidth;
      let finalHeight = finalWidth / aspectRatio;
      
      // If height exceeds available height, scale down
      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = finalHeight * aspectRatio;
      }
      
      // Center the content on the page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save('resume.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderTemplate = (): JSX.Element => {
    // If no resume data, show a placeholder
    if (!currentResumeData) {
      return (
        <div className="bg-white shadow-sm border rounded-md max-w-[800px] mx-auto p-8 text-black">
          <div className="text-center">
            <p className="text-gray-500">No resume data available. Please create or select a resume first.</p>
          </div>
        </div>
      );
    }
    
    // Render the appropriate template based on the current template
    switch (currentResumeTemplate) {
      case 'minimal':
        return <MinimalTemplate />;
      case 'modern':
        return <ModernTemplate />;
      case 'classic':
        return <ClassicTemplate />;
      case 'executive':
        return <ExecutiveTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'tech':
        return <TechTemplate />;
      default:
        return <MinimalTemplate />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff]">
      <Navbar />
      
      <div className="container max-w-screen-xl mx-auto px-4 pt-24 pb-16">
        {!currentResumeData ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-[#2d2b4e] mb-4">No Resume Selected</h2>
            <p className="text-[#4a4869] mb-6">Please select a resume from the dashboard to preview.</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/builder')}
                  className="gap-1 border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Editor
                </Button>
                
                <h1 className="text-2xl font-bold text-[#2d2b4e]">Resume Preview</h1>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-auto">
                  <Select
                    value={currentResumeTemplate || 'minimal'}
                    onValueChange={setCurrentResumeTemplate}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] border-[#e8f3ff] text-[#4a4869] focus:ring-[#6366f1]/10">
                      <SelectValue placeholder="Choose Template" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#e8f3ff]">
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    onClick={handleDownloadPDF}
                    className="gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  >
                    <Download className="h-4 w-4" /> PDF
                  </Button>

                  <Button 
                    variant="default" 
                    onClick={handleDownloadWord}
                    className="gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  >
                    <Download className="h-4 w-4" /> Word
                  </Button>

                  <Button 
                    variant="default" 
                    onClick={handleDownloadHTML}
                    className="gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  >
                    <Download className="h-4 w-4" /> HTML
                  </Button>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-[#f8f2ff]">
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-[#6366f1] data-[state=active]:text-white text-[#4a4869]"
                >
                  <FileText className="h-4 w-4 mr-2" /> Preview
                </TabsTrigger>
                <TabsTrigger 
                  value="layout" 
                  className="data-[state=active]:bg-[#6366f1] data-[state=active]:text-white text-[#4a4869]"
                >
                  <LayoutList className="h-4 w-4 mr-2" /> Edit Layout
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-6">
                <style>
                  {`
                    @media print {
                      body * {
                        visibility: hidden;
                      }
                      #resume-preview-container * {
                        visibility: visible;
                      }
                      #resume-preview-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                      }
                    }
                  `}
                </style>
                <div 
                  ref={resumeRef}
                  id="resume-preview-container"
                  className="bg-white print:shadow-none print:border-none"
                  style={{
                    width: '800px',
                    margin: '0 auto',
                    minHeight: '1000px'
                  }}
                >
                  {renderTemplate()}
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="mt-6 space-y-8">
                <div className="bg-white border border-[#e8f3ff] rounded-md p-6">
                  <h2 className="text-xl font-bold text-[#2d2b4e] mb-4">Customize Section Order</h2>
                  <p className="text-[#4a4869] mb-4">
                    Drag and drop sections to reorder them. Changes will be reflected in your resume preview.
                  </p>
                  
                  <DraggableResumeSection 
                    sections={currentSectionOrder} 
                    onSectionsReordered={setSectionOrder}
                    previewContainerRef={resumeRef}
                  />
                </div>
                
                <SavedTemplates />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Preview;