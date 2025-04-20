import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeSectionType } from '@/components/resume/DraggableResumeSection';

// Types for resume data
export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  title: string;
  summary: string;
  profileImage?: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  templateId: string | null;
};

export type CustomTemplate = {
  id: string;
  name: string;
  templateId: string;
  sectionOrder: ResumeSectionType[];
  createdAt: Date;
  lastModified: Date;
};

// Initial empty state
const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    title: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  templateId: null,
};

// Default section order
const defaultSectionOrder: ResumeSectionType[] = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

// Zustand store with persistence
type ResumeStore = {
  resumeList: { id: string; name: string; lastModified: Date }[];
  customTemplates: CustomTemplate[];
  currentResumeId: string | null;
  currentResumeData: ResumeData;
  currentStep: number;
  currentResumeTemplate: string | null;
  currentSectionOrder: ResumeSectionType[];
  
  // Actions
  setCurrentResumeId: (id: string | null) => void;
  updatePersonalInfo: (personalInfo: Partial<PersonalInfo>) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  setTemplateId: (templateId: string | null) => void;
  setCurrentResumeTemplate: (template: string | null) => void;
  setSectionOrder: (sectionOrder: ResumeSectionType[]) => void;
  createNewResume: (name: string) => void;
  setCurrentStep: (step: number) => void;
  resetResumeData: () => void;
  saveCustomTemplate: (name: string) => void;
  applyCustomTemplate: (customTemplateId: string) => void;
  deleteCustomTemplate: (customTemplateId: string) => void;
  deleteResume: (id: string) => void;
  clearAllData: () => void;
};

const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initialize with empty array instead of any default resumes
      resumeList: [],
      customTemplates: [],
      currentResumeId: null,
      currentResumeData: { ...initialResumeData },
      currentStep: 0,
      currentResumeTemplate: 'minimal',
      currentSectionOrder: [...defaultSectionOrder],
      
      clearAllData: () => {
        localStorage.removeItem('resume-storage');
        set({
          resumeList: [],
          customTemplates: [],
          currentResumeId: null,
          currentResumeData: { ...initialResumeData },
          currentStep: 0,
          currentResumeTemplate: 'minimal',
          currentSectionOrder: [...defaultSectionOrder],
        });
      },
      
      setCurrentResumeId: (id) => {
        if (!id) {
          set({ currentResumeId: null, currentResumeData: { ...initialResumeData } });
          return;
        }

        const resume = get().resumeList.find(r => r.id === id);
        if (resume) {
          set({ 
            currentResumeId: id,
            currentResumeData: { ...initialResumeData }
          });
        }
      },
      
      updatePersonalInfo: (personalInfo) => 
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            personalInfo: {
              ...state.currentResumeData.personalInfo,
              ...personalInfo,
            },
          },
        })),
      
      setTemplateId: (templateId) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            templateId,
          },
        })),
      
      setCurrentResumeTemplate: (template) => set({ currentResumeTemplate: template }),
      
      setSectionOrder: (sectionOrder) => set({ currentSectionOrder: sectionOrder }),
      
      createNewResume: (name) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          resumeList: [
            ...state.resumeList,
            { id: newId, name, lastModified: new Date() },
          ],
          currentResumeId: newId,
          currentResumeData: { ...initialResumeData },
          currentStep: 0,
          currentSectionOrder: [...defaultSectionOrder],
        }));
      },
      
      deleteResume: (id) => {
        set((state) => ({
          resumeList: state.resumeList.filter(resume => resume.id !== id),
          currentResumeId: state.currentResumeId === id ? null : state.currentResumeId
        }));
      },
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      resetResumeData: () => set({ 
        currentResumeData: { ...initialResumeData },
        currentSectionOrder: [...defaultSectionOrder],
      }),
      
      saveCustomTemplate: (name) => {
        const newTemplateId = crypto.randomUUID();
        const { currentResumeTemplate, currentSectionOrder } = get();
        
        set((state) => ({
          customTemplates: [
            ...state.customTemplates,
            {
              id: newTemplateId,
              name,
              templateId: currentResumeTemplate || 'minimal',
              sectionOrder: [...currentSectionOrder],
              createdAt: new Date(),
              lastModified: new Date(),
            }
          ]
        }));
        
        return newTemplateId;
      },
      
      applyCustomTemplate: (customTemplateId) => {
        const template = get().customTemplates.find(t => t.id === customTemplateId);
        if (!template) return;
        
        set({
          currentResumeTemplate: template.templateId,
          currentSectionOrder: [...template.sectionOrder],
        });
      },
      
      deleteCustomTemplate: (customTemplateId) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter(t => t.id !== customTemplateId)
        }));
      },
      
      addEducation: (education) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            education: [...state.currentResumeData.education, { ...education, id: crypto.randomUUID() }],
          },
        })),
      
      updateEducation: (id, education) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            education: state.currentResumeData.education.map((item) =>
              item.id === id ? { ...item, ...education } : item
            ),
          },
        })),
      
      removeEducation: (id) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            education: state.currentResumeData.education.filter((item) => item.id !== id),
          },
        })),
      
      addExperience: (experience) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            experience: [...state.currentResumeData.experience, { ...experience, id: crypto.randomUUID() }],
          },
        })),
      
      updateExperience: (id, experience) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            experience: state.currentResumeData.experience.map((item) =>
              item.id === id ? { ...item, ...experience } : item
            ),
          },
        })),
      
      removeExperience: (id) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            experience: state.currentResumeData.experience.filter((item) => item.id !== id),
          },
        })),
      
      addSkill: (skill) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            skills: [...state.currentResumeData.skills, { ...skill, id: crypto.randomUUID() }],
          },
        })),
      
      updateSkill: (id, skill) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            skills: state.currentResumeData.skills.map((item) =>
              item.id === id ? { ...item, ...skill } : item
            ),
          },
        })),
      
      removeSkill: (id) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            skills: state.currentResumeData.skills.filter((item) => item.id !== id),
          },
        })),
      
      addProject: (project) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            projects: [...state.currentResumeData.projects, { ...project, id: crypto.randomUUID() }],
          },
        })),
      
      updateProject: (id, project) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            projects: state.currentResumeData.projects.map((item) =>
              item.id === id ? { ...item, ...project } : item
            ),
          },
        })),
      
      removeProject: (id) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            projects: state.currentResumeData.projects.filter((item) => item.id !== id),
          },
        })),
      
      addCertification: (certification) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            certifications: [...state.currentResumeData.certifications, { ...certification, id: crypto.randomUUID() }],
          },
        })),
      
      updateCertification: (id, certification) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            certifications: state.currentResumeData.certifications.map((item) =>
              item.id === id ? { ...item, ...certification } : item
            ),
          },
        })),
      
      removeCertification: (id) =>
        set((state) => ({
          currentResumeData: {
            ...state.currentResumeData,
            certifications: state.currentResumeData.certifications.filter((item) => item.id !== id),
          },
        })),
    }),
    {
      name: 'resume-storage',
      onRehydrateStorage: () => {
        // Clear storage on first load to avoid persisting default resumes
        return (state) => {
          // Check if this is the first time the app is loaded
          const isFirstLoad = !localStorage.getItem('resume-storage-initialized');
          
          if (isFirstLoad) {
            // Set the flag so this only runs once
            localStorage.setItem('resume-storage-initialized', 'true');
            
            // Reset the state to empty lists
            if (state) {
              state.resumeList = [];
              state.customTemplates = [];
              state.currentResumeId = null;
            }
          }
        };
      }
    }
  )
);

export default useResumeStore;
