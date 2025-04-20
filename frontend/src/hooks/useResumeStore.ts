import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeSectionType } from '@/components/resume/DraggableResumeSection';
import { resumeAPI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export type ResumeTemplate = 'minimal' | 'modern' | 'classic' | 'executive' | 'creative' | 'tech';

export interface CustomTemplate {
  id: string;
  name: string;
  template: ResumeTemplate;
  sectionOrder: ResumeSectionType[];
}

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  summary: string;
  profileImage?: string;
};

export interface Resume {
  id: string;
  name: string;
  lastModified: Date;
  personalInfo: PersonalInfo;
  education: any[];
  experience: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  templateId?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  link?: string;
}

interface ResumeStore {
  customTemplates: CustomTemplate[];
  saveCustomTemplate: (name: string) => void;
  applyCustomTemplate: (id: string) => void;
  deleteCustomTemplate: (id: string) => void;
  resumeList: Resume[];
  currentResumeId: string | null;
  currentResumeTemplate: ResumeTemplate | null;
  currentSectionOrder: ResumeSectionType[];
  currentResumeData: Resume | null;
  createNewResume: (name: string) => void;
  setCurrentResumeId: (id: string) => void;
  setCurrentResumeTemplate: (template: ResumeTemplate) => void;
  setSectionOrder: (sections: ResumeSectionType[]) => void;
  deleteResume: (id: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setTemplateId: (templateId: string) => void;
  clearAllData: () => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  saveResume: () => Promise<void>;
  loadResumes: () => Promise<void>;
}

const initialResumeData: Resume = {
  id: '',
  name: '',
  lastModified: new Date(),
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  templateId: 'minimal'
};

const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeList: [],
      customTemplates: [],
      currentResumeId: null,
      currentResumeTemplate: null,
      currentSectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'] as ResumeSectionType[],
      currentResumeData: null,
      
      loadResumes: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.log('No token found, clearing resume data');
            set({ 
              resumeList: [],
              currentResumeId: null,
              currentResumeData: null,
              currentResumeTemplate: null
            });
            return;
          }

          console.log('Loading resumes from backend...');
          const resumes = await resumeAPI.getUserResumes();
          console.log('Loaded resumes:', resumes);
          
          // Transform the backend resume format to frontend format
          const transformedResumes = resumes.map(resume => ({
            id: resume._id, // Use _id from MongoDB as id
            name: resume.personalDetails?.firstName 
              ? `${resume.personalDetails.firstName}'s Resume`
              : 'Untitled Resume',
            lastModified: resume.lastModified ? new Date(resume.lastModified) : new Date(),
            templateId: resume.template || 'minimal',
            personalInfo: {
              firstName: resume.personalDetails?.firstName || '',
              lastName: resume.personalDetails?.lastName || '',
              title: resume.personalDetails?.title || '',
              email: resume.personalDetails?.email || '',
              phone: resume.personalDetails?.phone || '',
              address: resume.personalDetails?.address || '',
              city: resume.personalDetails?.city || '',
              state: resume.personalDetails?.state || '',
              zip: resume.personalDetails?.zip || '',
              summary: resume.personalDetails?.summary || ''
            },
            education: resume.education || [],
            experience: resume.experience || [],
            skills: resume.skills || [],
            projects: resume.projects || [],
            certifications: resume.certifications || []
          }));
          
          console.log('Transformed resumes:', transformedResumes);
          
          set({ 
            resumeList: transformedResumes,
            // If we have a current resume ID, update its data
            currentResumeData: transformedResumes.find(r => r.id === get().currentResumeId) || null
          });
        } catch (error) {
          console.error('Failed to load resumes:', error);
          toast({
            title: "Error",
            description: "Failed to load your resumes. Please try again.",
            variant: "destructive"
          });
        }
      },

      saveResume: async () => {
        const state = get();
        if (!state.currentResumeData) {
          console.log('❌ No resume data to save');
          toast({
            title: "Error",
            description: "No resume data to save. Please create a resume first.",
            variant: "destructive"
          });
          return;
        }

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('❌ No token found in localStorage');
          toast({
            title: "Error",
            description: "Please login to save your resume",
            variant: "destructive"
          });
          return;
        }

        try {
          const { personalInfo, education, skills, experience, projects, certifications, templateId } = state.currentResumeData;
          
          // Format personal details to match server expectations
          const personalDetails = {
            firstName: personalInfo?.firstName || '',
            lastName: personalInfo?.lastName || '',
            title: personalInfo?.title || '',
            email: personalInfo?.email || '',
            phone: personalInfo?.phone || '',
            address: personalInfo?.address || '',
            city: personalInfo?.city || '',
            state: personalInfo?.state || '',
            zip: personalInfo?.zip || '',
            summary: personalInfo?.summary || ''
          };

          // Ensure arrays are initialized and properly formatted
          const resumeData = {
            _id: state.currentResumeData.id, // Include the ID if it exists
            personalDetails,
            education: education || [],
            skills: skills || [],
            experience: experience || [],
            projects: projects || [],
            certifications: certifications || [],
            template: templateId || state.currentResumeTemplate || 'minimal', // Use templateId or currentResumeTemplate
            lastModified: new Date(),
            name: `${personalDetails.firstName}'s Resume` || 'Untitled Resume' // Add name field
          };

          console.log('📝 Saving resume data:', resumeData);

          const response = await resumeAPI.saveResume(resumeData);
          console.log('✅ Save response:', response);

          // Update the local state with the saved data
          if (response.data?.resume) {
            const savedResume = response.data.resume;
            const transformedResume = {
              id: savedResume._id,
              name: savedResume.personalDetails?.firstName 
                ? `${savedResume.personalDetails.firstName}'s Resume`
                : 'Untitled Resume',
              lastModified: savedResume.lastModified ? new Date(savedResume.lastModified) : new Date(),
              templateId: savedResume.template || 'minimal',
              personalInfo: savedResume.personalDetails || personalDetails,
              education: savedResume.education || [],
              experience: savedResume.experience || [],
              skills: savedResume.skills || [],
              projects: savedResume.projects || [],
              certifications: savedResume.certifications || []
            };

            set(state => ({
              ...state,
              currentResumeData: transformedResume,
              resumeList: state.resumeList.map(r => 
                r.id === transformedResume.id ? transformedResume : r
              )
            }));

            toast({
              title: "Success",
              description: response.message || "Resume saved successfully!",
            });
          }
        } catch (error: any) {
          console.error('❌ Failed to save resume:', error);
          
          // Handle token expiration
          if (error.message === 'Session expired. Please login again.' || 
              error.message === 'Invalid token' || 
              error.message === 'Token expired') {
            toast({
              title: "Session Expired",
              description: "Please login again to continue",
              variant: "destructive"
            });
            return;
          }
          
          // Extract error message from the response if available
          const errorMessage = error.response?.data?.error || error.message || "Failed to save your resume";
          const errorDetails = error.response?.data?.details;
          
          toast({
            title: "Error",
            description: errorMessage + (errorDetails ? `\n${errorDetails}` : ''),
            variant: "destructive"
          });
        }
      },

      createNewResume: (name) => {
        const newResume: Resume = {
          ...initialResumeData,
          id: Date.now().toString(),
          name,
          lastModified: new Date(),
        };
        
        set((state) => ({
          resumeList: [...state.resumeList, newResume],
          currentResumeId: newResume.id,
          currentResumeData: newResume,
          currentSectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'] as ResumeSectionType[],
        }));

        // Save to MongoDB
        get().saveResume();
      },
      
      setCurrentResumeId: (id) => {
        const resume = get().resumeList.find(r => r.id === id) || null;
        set({
          currentResumeId: id,
          currentResumeData: resume,
          currentSectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'] as ResumeSectionType[],
        });
      },
      
      updatePersonalInfo: (info) => {
        set((state) => {
          if (!state.currentResumeData) return state;
          
          const updatedResume = {
            ...state.currentResumeData,
            personalInfo: {
              ...state.currentResumeData.personalInfo,
              ...info
            },
            lastModified: new Date()
          };
          
          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume => 
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB
          get().saveResume();
          
          return newState;
        });
      },
      
      setCurrentResumeTemplate: (template: ResumeTemplate) => {
        set((state) => {
          // If we have a current resume, update its template
          if (state.currentResumeData) {
            const updatedResume = {
              ...state.currentResumeData,
              templateId: template,
              lastModified: new Date()
            };
            
            return {
              currentResumeTemplate: template,
              currentResumeData: updatedResume,
              resumeList: state.resumeList.map(resume => 
                resume.id === updatedResume.id ? updatedResume : resume
              )
            };
          }
          
          // If no current resume, just update the template
          return { currentResumeTemplate: template };
        });
        
        // Save to MongoDB
        get().saveResume();
      },

      saveCustomTemplate: (name) => {
        set((state) => ({
          customTemplates: [
            ...state.customTemplates,
            {
              id: Date.now().toString(),
              name,
              template: state.currentResumeTemplate || 'minimal',
              sectionOrder: state.currentSectionOrder,
            },
          ],
        }));
      },

      applyCustomTemplate: (id) => {
        const template = get().customTemplates.find(t => t.id === id);
        if (template) {
          set({
            currentResumeTemplate: template.template,
            currentSectionOrder: template.sectionOrder,
          });
          get().saveResume();
        }
      },

      deleteCustomTemplate: (id) => set((state) => ({
        customTemplates: state.customTemplates.filter(t => t.id !== id),
      })),
      
      setSectionOrder: (sections: ResumeSectionType[]) => {
        set({ currentSectionOrder: sections });
        get().saveResume();
      },
      
      deleteResume: async (id) => {
        try {
          await resumeAPI.deleteResume(id);
          set((state) => ({
            resumeList: state.resumeList.filter(resume => resume.id !== id),
            currentResumeId: state.currentResumeId === id ? null : state.currentResumeId,
            currentResumeData: state.currentResumeId === id ? null : state.currentResumeData,
          }));
          toast({
            title: "Success",
            description: "Resume deleted successfully!",
          });
        } catch (error) {
          console.error('Failed to delete resume:', error);
          toast({
            title: "Error",
            description: "Failed to delete resume. Please try again.",
            variant: "destructive"
          });
        }
      },

      setTemplateId: (templateId) => {
        const currentId = get().currentResumeId;
        if (!currentId) return;

        set((state) => {
          if (!state.currentResumeData) return state;
          
          const updatedResume = {
            ...state.currentResumeData,
            templateId,
            lastModified: new Date()
          };
          
          return {
            resumeList: state.resumeList.map(resume => 
              resume.id === currentId 
                ? { ...resume, templateId, lastModified: new Date() }
                : resume
            ),
            currentResumeData: updatedResume,
            currentResumeTemplate: templateId as ResumeTemplate
          };
        });
        
        // Save to MongoDB
        get().saveResume();
      },

      clearAllData: () => {
        localStorage.removeItem('resume-storage');
        localStorage.removeItem('resume-storage-initialized');
        set({
          resumeList: [],
          currentResumeId: null,
          currentResumeData: null,
          currentResumeTemplate: 'minimal',
          currentSectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
        });
      },

      addEducation: (education) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const newEducation = {
            ...education,
            id: Date.now().toString(),
          };

          const updatedResume = {
            ...state.currentResumeData,
            education: [...state.currentResumeData.education, newEducation],
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      updateEducation: (id, education) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedEducation = {
            ...state.currentResumeData.education.find(e => e.id === id),
            ...education,
            lastModified: new Date()
          };

          const updatedResume = {
            ...state.currentResumeData,
            education: state.currentResumeData.education.map(e =>
              e.id === id ? updatedEducation : e
            ),
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      removeEducation: (id) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            education: state.currentResumeData.education.filter(edu => edu.id !== id),
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      addExperience: (experience) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const newExperience = {
            ...experience,
            id: Date.now().toString(),
          };

          const updatedResume = {
            ...state.currentResumeData,
            experience: [...state.currentResumeData.experience, newExperience],
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      updateExperience: (id, experience) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedExperience = {
            ...state.currentResumeData.experience.find(e => e.id === id),
            ...experience,
            lastModified: new Date()
          };

          const updatedResume = {
            ...state.currentResumeData,
            experience: state.currentResumeData.experience.map(e =>
              e.id === id ? updatedExperience : e
            ),
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      removeExperience: (id) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            experience: state.currentResumeData.experience.filter(exp => exp.id !== id),
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      addSkill: (skill: Omit<Skill, 'id'>) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const skillWithId = {
            ...skill,
            id: crypto.randomUUID(),
            lastModified: new Date()
          };

          const updatedResume = {
            ...state.currentResumeData,
            skills: [...state.currentResumeData.skills, skillWithId],
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      removeSkill: (id: string) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            skills: state.currentResumeData.skills.filter(s => s.id !== id),
            lastModified: new Date()
          };

          return {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };
        });
      },

      addProject: (project: Omit<Project, 'id'>) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const newProject = {
            ...project,
            id: Date.now().toString(),
          };

          const updatedResume = {
            ...state.currentResumeData,
            projects: [...state.currentResumeData.projects, newProject],
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB immediately
          get().saveResume();
          
          return newState;
        });
      },

      updateProject: (id: string, project: Partial<Project>) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            projects: state.currentResumeData.projects.map(p => 
              p.id === id ? { ...p, ...project } : p
            ),
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB immediately
          get().saveResume();
          
          return newState;
        });
      },

      removeProject: (id: string) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            projects: state.currentResumeData.projects.filter(project => project.id !== id),
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB
          setTimeout(() => get().saveResume(), 0);
          
          return newState;
        });
      },

      addCertification: (certification: Omit<Certification, 'id'>) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const newCertification = {
            ...certification,
            id: Date.now().toString(),
          };

          const updatedResume = {
            ...state.currentResumeData,
            certifications: [...state.currentResumeData.certifications, newCertification],
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB immediately
          get().saveResume();
          
          return newState;
        });
      },

      updateCertification: (id: string, certification: Partial<Certification>) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            certifications: state.currentResumeData.certifications.map(c => 
              c.id === id ? { ...c, ...certification } : c
            ),
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB immediately
          get().saveResume();
          
          return newState;
        });
      },

      removeCertification: (id: string) => {
        set((state) => {
          if (!state.currentResumeData) return state;

          const updatedResume = {
            ...state.currentResumeData,
            certifications: state.currentResumeData.certifications.filter(cert => cert.id !== id),
            lastModified: new Date()
          };

          const newState = {
            currentResumeData: updatedResume,
            resumeList: state.resumeList.map(resume =>
              resume.id === updatedResume.id ? updatedResume : resume
            )
          };

          // Save to MongoDB
          setTimeout(() => get().saveResume(), 0);
          
          return newState;
        });
      },
    }),
    {
      name: 'resume-storage',
      onRehydrateStorage: () => {
        return async (state) => {
          console.log('Rehydrating resume store...');
          const token = localStorage.getItem('token');
          
          if (!token) {
            console.log('No token found during rehydration, clearing data');
            if (state) {
              state.resumeList = [];
              state.currentResumeId = null;
              state.currentResumeData = null;
              state.currentResumeTemplate = null;
            }
            return;
          }

          console.log('Token found during rehydration, loading resumes');
          if (state) {
            try {
              const resumes = await resumeAPI.getUserResumes();
              console.log('Loaded resumes during rehydration:', resumes);
              
              // Transform the backend resume format to frontend format
              const transformedResumes = resumes.map(resume => ({
                id: resume._id,
                name: resume.personalDetails?.firstName 
                  ? `${resume.personalDetails.firstName}'s Resume`
                  : 'Untitled Resume',
                lastModified: resume.lastModified ? new Date(resume.lastModified) : new Date(),
                templateId: resume.template || 'minimal',
                personalInfo: {
                  firstName: resume.personalDetails?.firstName || '',
                  lastName: resume.personalDetails?.lastName || '',
                  title: resume.personalDetails?.title || '',
                  email: resume.personalDetails?.email || '',
                  phone: resume.personalDetails?.phone || '',
                  address: resume.personalDetails?.address || '',
                  city: resume.personalDetails?.city || '',
                  state: resume.personalDetails?.state || '',
                  zip: resume.personalDetails?.zip || '',
                  summary: resume.personalDetails?.summary || ''
                },
                education: resume.education || [],
                experience: resume.experience || [],
                skills: resume.skills || [],
                projects: resume.projects || [],
                certifications: resume.certifications || []
              }));
              
              console.log('Transformed resumes during rehydration:', transformedResumes);
              
              state.resumeList = transformedResumes;
              
              // If there's a currentResumeId, update currentResumeData
              if (state.currentResumeId) {
                state.currentResumeData = transformedResumes.find(r => r.id === state.currentResumeId) || null;
              }
              
              console.log('Updated state after rehydration:', {
                resumeList: state.resumeList,
                currentResumeId: state.currentResumeId,
                currentResumeData: state.currentResumeData
              });
            } catch (error) {
              console.error('Failed to load resumes during rehydration:', error);
              // Clear data on error
              state.resumeList = [];
              state.currentResumeId = null;
              state.currentResumeData = null;
            }
          }
        };
      },
      partialize: (state) => ({
        resumeList: state.resumeList,
        customTemplates: state.customTemplates,
        currentResumeId: state.currentResumeId,
        currentResumeTemplate: state.currentResumeTemplate,
        currentSectionOrder: state.currentSectionOrder,
        currentResumeData: state.currentResumeData,
      }),
    }
  )
);

// Update the token change listener to be more robust
if (typeof window !== 'undefined') {
  let previousToken = localStorage.getItem('token');
  let checkInterval: NodeJS.Timeout;

  const checkToken = () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken !== previousToken) {
      console.log('Token changed, reloading resumes...');
      previousToken = currentToken;
      if (currentToken) {
        useResumeStore.getState().loadResumes();
      } else {
        // Clear data when token is removed
        useResumeStore.setState({
          resumeList: [],
          currentResumeId: null,
          currentResumeData: null,
          currentResumeTemplate: null
        });
      }
    }
  };

  // Clear existing interval if any
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Start new interval
  checkInterval = setInterval(checkToken, 1000);
}

export default useResumeStore; 