import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, FileText, Download, Trash2, Edit2, MoreVertical, User, Mail, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useResumeStore from '@/hooks/useResumeStore';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumeList, createNewResume, setCurrentResumeId, deleteResume, currentResumeData, loadResumes } = useResumeStore();
  const { user } = useAuthStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  
  // Load resumes when component mounts and when auth state changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in dashboard, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Loading resumes in dashboard...');
    loadResumes().then(() => {
      console.log('Resumes loaded successfully');
    }).catch(error => {
      console.error('Failed to load resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load your resumes. Please try again.",
        variant: "destructive"
      });
    });
  }, [loadResumes, navigate]);
  
  const handleCreateResume = () => {
    if (!newResumeName.trim()) {
      toast({
        title: "Resume name required",
        description: "Please enter a name for your resume.",
        variant: "destructive"
      });
      return;
    }
    
    createNewResume(newResumeName);
    setNewResumeName('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Resume created",
      description: "Your new resume has been created.",
    });
    
    // Navigate to the builder page
    navigate('/builder');
  };
  
  const handleSelectResume = async (id: string) => {
    try {
      // First try to find the resume in the current list
      const selectedResume = resumeList.find(r => r.id === id);
      
      if (!selectedResume) {
        console.log('Resume not found in current list, reloading resumes...');
        // If not found, try reloading the resumes first
        await loadResumes();
        
        // Check again after reloading
        const reloadedResume = resumeList.find(r => r.id === id);
        if (!reloadedResume) {
          toast({
            title: "Error",
            description: "Could not find the selected resume.",
            variant: "destructive"
          });
          return;
        }
      }
      
      console.log('Setting current resume:', id);
      setCurrentResumeId(id);
      navigate('/builder');
    } catch (error) {
      console.error('Error selecting resume:', error);
      toast({
        title: "Error",
        description: "Failed to load the selected resume. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    if (resumeToDelete) {
      deleteResume(resumeToDelete);
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been permanently deleted.",
      });
      
      setResumeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleExportPDF = async (resumeId: string) => {
    setCurrentResumeId(resumeId);
    navigate('/preview');
  };

  const handleExportWord = (resumeId: string) => {
    const resume = resumeList.find(r => r.id === resumeId);
    if (!resume) return;

    const { personalInfo } = resume;
    
    // Create a simple Word-compatible HTML document
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${resume.name}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #2d2b4e; margin-bottom: 5px; }
          .title { color: #4a4869; font-size: 18px; margin-bottom: 20px; }
          .contact-info { margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #2d2b4e; border-bottom: 2px solid #e8f3ff; padding-bottom: 5px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="resume-content">
          <h1>${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}</h1>
          ${personalInfo?.title ? `<div class="title">${personalInfo.title}</div>` : ''}
          
          <div class="contact-info">
            ${personalInfo?.email ? `<div>Email: ${personalInfo.email}</div>` : ''}
            ${personalInfo?.phone ? `<div>Phone: ${personalInfo.phone}</div>` : ''}
            ${personalInfo?.city || personalInfo?.state ? 
              `<div>Location: ${[personalInfo.city, personalInfo.state].filter(Boolean).join(', ')}</div>` 
              : ''
            }
          </div>

          ${personalInfo?.summary ? `
            <div class="section">
              <h2 class="section-title">Professional Summary</h2>
              <div>${personalInfo.summary}</div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([wordContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resume.name}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: "Resume Exported",
      description: "Your resume has been exported as a Word document.",
    });
  };

  const handleExportHTML = (resumeId: string) => {
    const resume = resumeList.find(r => r.id === resumeId);
    if (!resume) return;

    const { personalInfo } = resume;
    
    // Create a styled HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0;
            padding: 40px;
            color: #2d2b4e;
          }
          .resume-content { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          h1 { 
            color: #2d2b4e; 
            margin-bottom: 5px;
            font-size: 32px;
          }
          .title { 
            color: #4a4869; 
            font-size: 18px;
            margin-bottom: 20px;
          }
          .contact-info { 
            margin-bottom: 30px;
            color: #4a4869;
          }
          .section { 
            margin-bottom: 25px;
          }
          .section-title {
            color: #2d2b4e;
            font-size: 1.5rem;
            font-weight: 600;
            letter-spacing: -0.025em;
            border-bottom: 2px solid #e8f3ff;
            padding-bottom: 0.5rem;
            margin-bottom: 1.25rem;
            font-family: inherit;
          }
          .section-heading {
            composes: section-title;
          }
        </style>
      </head>
      <body>
        <div class="resume-content">
          <h1>${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}</h1>
          ${personalInfo?.title ? `<div class="title">${personalInfo.title}</div>` : ''}
          
          <div class="contact-info">
            ${personalInfo?.email ? `<div>Email: ${personalInfo.email}</div>` : ''}
            ${personalInfo?.phone ? `<div>Phone: ${personalInfo.phone}</div>` : ''}
            ${personalInfo?.city || personalInfo?.state ? 
              `<div>Location: ${[personalInfo.city, personalInfo.state].filter(Boolean).join(', ')}</div>` 
              : ''
            }
          </div>

          ${personalInfo?.summary ? `
            <div class="section">
              <h2 class="section-title">Professional Summary</h2>
              <div>${personalInfo.summary}</div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resume.name}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: "Resume Exported",
      description: "Your resume has been exported as an HTML file.",
    });
  };

  const formatLastModified = (lastModified: string | Date) => {
    try {
      const date = typeof lastModified === 'string' ? parseISO(lastModified) : lastModified;
      if (!date || isNaN(date.getTime())) {
        return 'Recently modified';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently modified';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff]">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* User Profile Section */}
          <Card className="mb-8 border border-[#e8f3ff]">
            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-[#6366f1]/10 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user?.name || 'Profile'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-[#6366f1]" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[#2d2b4e]">
                    {user?.name || 'Anonymous User'}
                  </h2>
                  <div className="flex items-center text-[#4a4869] mt-1">
                    <Mail className="h-4 w-4 mr-1.5" />
                    <span>{user?.email || 'No email provided'}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0 border-[#e8f3ff] text-[#4a4869] hover:text-[#6366f1] hover:bg-[#f8f2ff]"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-[#2d2b4e]">My Resumes</h1>
              <p className="text-[#4a4869] mt-1">
                Manage and create your resumes
              </p>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </motion.div>
          
          {resumeList.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <FileText className="h-12 w-12 mx-auto mb-4 text-[#4a4869] opacity-50" />
                <h3 className="text-xl font-semibold text-[#2d2b4e] mb-2">No resumes yet</h3>
                <p className="text-[#4a4869] mb-6">Create your first resume to get started on your professional journey.</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Resume
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeList.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                >
                  <Card className="bg-white/50 backdrop-blur-sm border-[#e8f3ff] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#2d2b4e]">{resume.name}</CardTitle>
                          <CardDescription>
                            Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSelectResume(resume.id)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportPDF(resume.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setResumeToDelete(resume.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Preview thumbnail or stats could go here */}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#e8f3ff] hover:bg-[#f8f2ff]"
                        onClick={() => handleSelectResume(resume.id)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Resume
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#2d2b4e]">Create New Resume</DialogTitle>
                <DialogDescription className="text-[#4a4869]">
                  Give your resume a name to help you identify it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="My Professional Resume"
                    value={newResumeName}
                    onChange={(e) => setNewResumeName(e.target.value)}
                    className="border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateResume}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                >
                  Create Resume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#2d2b4e]">Delete Resume</DialogTitle>
                <DialogDescription className="text-[#4a4869]">
                  Are you sure you want to delete this resume? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
