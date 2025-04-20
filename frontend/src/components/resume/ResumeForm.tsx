import { useState } from 'react';
import useResumeStore from '@/hooks/useResumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FormStepIndicator from './FormStepIndicator';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Project, Certification } from '@/types/resume';

// Summary Form
export const SummaryForm = () => {
  const { currentResumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = currentResumeData;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea 
          id="summary" 
          value={personalInfo.summary} 
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="A brief summary of your professional background and goals..."
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
};

// Personal Information Form
export const PersonalInfoForm = () => {
  const { currentResumeData, updatePersonalInfo } = useResumeStore();
  
  if (!currentResumeData) {
    return null;
  }

  const { personalInfo = {
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
    profileImage: undefined
  } } = currentResumeData;
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={personalInfo.firstName} 
                onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={personalInfo.lastName} 
                onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input 
              id="title" 
              value={personalInfo.title} 
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
              placeholder="Frontend Developer"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={personalInfo.email} 
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={personalInfo.phone} 
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={personalInfo.address} 
              onChange={(e) => updatePersonalInfo({ address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={personalInfo.city} 
                onChange={(e) => updatePersonalInfo({ city: e.target.value })}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                value={personalInfo.state} 
                onChange={(e) => updatePersonalInfo({ state: e.target.value })}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input 
                id="zip" 
                value={personalInfo.zip} 
                onChange={(e) => updatePersonalInfo({ zip: e.target.value })}
                placeholder="10001"
              />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="space-y-4">
            <Label>Profile Photo</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 h-48">
              {personalInfo.profileImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => updatePersonalInfo({ profileImage: undefined })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  >
                    Select Image
                  </Button>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea 
          id="summary" 
          value={personalInfo.summary} 
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="A brief summary of your professional background and goals..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
};

// Education Form
export const EducationForm = () => {
  const { currentResumeData, addEducation, updateEducation, removeEducation } = useResumeStore();

  if (!currentResumeData) {
    return null;
  }
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  
  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      addEducation(newEducation);
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      {currentResumeData.education.map((edu) => (
        <Card key={edu.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.startDate && edu.startDate} {edu.startDate && edu.endDate && '–'} {edu.endDate}
                  </p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            {edu.description && (
              <p className="mt-3 text-sm">{edu.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="font-medium">Add Education</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input 
                id="institution" 
                value={newEducation.institution} 
                onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                placeholder="University of California"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input 
                id="degree" 
                value={newEducation.degree} 
                onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                placeholder="Bachelor of Science"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input 
                id="field" 
                value={newEducation.field} 
                onChange={(e) => setNewEducation({...newEducation, field: e.target.value})}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                value={newEducation.startDate} 
                onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
                placeholder="Sep 2018"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                value={newEducation.endDate} 
                onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
                placeholder="May 2022 (or 'Present')"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newEducation.description} 
              onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
              placeholder="Notable achievements, relevant coursework, etc."
              className="min-h-[80px]"
            />
          </div>
          
          <Button onClick={handleAddEducation} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Experience Form
export const ExperienceForm = () => {
  const { currentResumeData, addExperience, updateExperience, removeExperience } = useResumeStore();

  if (!currentResumeData) {
    return null;
  }
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });
  
  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      addExperience(newExperience);
      setNewExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      {currentResumeData.experience.map((exp) => (
        <Card key={exp.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{exp.position}</h3>
                <p className="text-muted-foreground">{exp.company}{exp.location && `, ${exp.location}`}</p>
                {(exp.startDate || exp.endDate) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.startDate && exp.startDate} {exp.startDate && (exp.current ? '– Present' : `– ${exp.endDate}`)}
                  </p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            {exp.description && (
              <p className="mt-3 text-sm">{exp.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="font-medium">Add Experience</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={newExperience.company} 
                onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                placeholder="Google"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                value={newExperience.position} 
                onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                placeholder="Senior Developer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={newExperience.location} 
                onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                placeholder="Mountain View, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                value={newExperience.startDate} 
                onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                placeholder="Jan 2020"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="endDate" 
                  value={newExperience.endDate} 
                  onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                  placeholder="Dec 2022"
                  disabled={newExperience.current}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={newExperience.current}
                    onChange={(e) => setNewExperience({...newExperience, current: e.target.checked})}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor="current" className="text-sm cursor-pointer">Current</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newExperience.description} 
              onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
              placeholder="Your responsibilities, achievements, and projects in this role."
              className="min-h-[120px]"
            />
          </div>
          
          <Button onClick={handleAddExperience} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Skills Form
export const SkillsForm = () => {
  const { currentResumeData, addSkill, removeSkill } = useResumeStore();

  if (!currentResumeData) {
    return null;
  }
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 3,
  });
  
  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill(newSkill);
      setNewSkill({
        name: '',
        level: 3,
      });
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="font-medium">Add Skill</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input 
                  id="skillName" 
                  value={newSkill.name} 
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="React.js"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {newSkill.level === 1 && 'Beginner'}
                    {newSkill.level === 2 && 'Elementary'}
                    {newSkill.level === 3 && 'Intermediate'}
                    {newSkill.level === 4 && 'Advanced'}
                    {newSkill.level === 5 && 'Expert'}
                  </span>
                </div>
                <input
                  id="skillLevel"
                  type="range"
                  min="1"
                  max="5"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleAddSkill} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h3 className="font-medium">Your Skills</h3>
          
          {currentResumeData.skills.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No skills added yet. Add your skills to showcase your expertise.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentResumeData.skills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="group flex justify-between items-center p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 w-6 rounded-full mr-1 ${
                            i < skill.level ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Projects & Certifications Form
export const ProjectsCertificationsForm = () => {
  const { currentResumeData, addProject, removeProject, updateProject, addCertification, removeCertification, updateCertification } = useResumeStore();
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    link: '',
  });
  const [newCertification, setNewCertification] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    link: '',
  });

  const handleProjectChange = (field: keyof Project, value: string) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationChange = (field: keyof Certification, value: string) => {
    setNewCertification(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProject = () => {
    if (newProject.name) {
      addProject(newProject);
      setNewProject({
        name: '',
        description: '',
        link: '',
      });
    }
  };

  const handleAddCertification = () => {
    if (newCertification.name) {
      addCertification(newCertification);
      setNewCertification({
        name: '',
        issuer: '',
        date: '',
        link: '',
      });
    }
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
    updateProject(id, { [field]: value });
  };

  const handleUpdateCertification = (id: string, field: keyof Certification, value: string) => {
    updateCertification(id, { [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium mb-4">Projects</h3>
        <div className="space-y-4">
          {currentResumeData?.projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{project.name}</h3>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline mt-1 block">
                        View Project
                      </a>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeProject(project.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-medium">Add Project</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => handleProjectChange('name', e.target.value)}
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => handleProjectChange('description', e.target.value)}
                    placeholder="Describe your project and its impact..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    value={newProject.link}
                    onChange={(e) => handleProjectChange('link', e.target.value)}
                    placeholder="https://github.com/yourusername/project"
                  />
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Certifications</h3>
        <div className="space-y-4">
          {currentResumeData?.certifications.map((certification) => (
            <Card key={certification.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{certification.name}</h3>
                    <p className="text-muted-foreground">{certification.issuer}</p>
                    {certification.date && (
                      <p className="text-sm text-muted-foreground mt-1">{certification.date}</p>
                    )}
                    {certification.link && (
                      <a href={certification.link} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-primary hover:underline mt-1 block">
                        View Certificate
                      </a>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeCertification(certification.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-medium">Add Certification</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    value={newCertification.name}
                    onChange={(e) => handleCertificationChange('name', e.target.value)}
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuing Organization</Label>
                  <Input
                    value={newCertification.issuer}
                    onChange={(e) => handleCertificationChange('issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newCertification.date}
                    onChange={(e) => handleCertificationChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    value={newCertification.link}
                    onChange={(e) => handleCertificationChange('link', e.target.value)}
                    placeholder="https://www.credential.net/..."
                  />
                </div>
                <Button onClick={handleAddCertification} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Certification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Resume Form Component
export const ResumeForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5; // Number of form sections
  
  const handleContinueToTemplates = () => {
    navigate('/templates');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <FormStepIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps}
        />
        
        <div className="space-y-8">
          {currentStep === 0 && <PersonalInfoForm />}
          {currentStep === 1 && <EducationForm />}
          {currentStep === 2 && <ExperienceForm />}
          {currentStep === 3 && <SkillsForm />}
          {currentStep === 4 && <ProjectsCertificationsForm />}
        </div>

        <div className="flex justify-between mt-8">
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
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
