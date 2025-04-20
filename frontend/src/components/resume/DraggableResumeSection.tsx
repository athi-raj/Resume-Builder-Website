
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GripVertical, AlertTriangle } from 'lucide-react';

// Define the resume section types
export type ResumeSectionType = 
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications';

// Section display names
const sectionNames: Record<ResumeSectionType, string> = {
  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

// Sections that are required for ATS compatibility
const atsRequiredSections: ResumeSectionType[] = [
  'personalInfo',
  'experience',
  'education',
  'skills',
];

// Define props for the component
export interface DraggableResumeSectionProps {
  sections: ResumeSectionType[];
  onSectionsReordered: (newSections: ResumeSectionType[]) => void;
  previewContainerRef?: React.RefObject<HTMLDivElement>;
}

const DraggableResumeSection: React.FC<DraggableResumeSectionProps> = ({
  sections,
  onSectionsReordered,
  previewContainerRef,
}) => {
  const [orderWarningOpen, setOrderWarningOpen] = useState(false);
  const [attemptedReorder, setAttemptedReorder] = useState<ResumeSectionType[]>([]);
  
  // Check if a reordering would break ATS compatibility
  const isAtsCompatible = (newOrder: ResumeSectionType[]): boolean => {
    // For this implementation, we'll keep it simple:
    // Make sure all ATS required sections are included
    // In a real implementation, you might have more complex rules
    return atsRequiredSections.every(section => newOrder.includes(section));
  };
  
  // Handle the end of a drag operation
  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Reorder the sections based on drag result
    const newSectionOrder = Array.from(sections);
    const [movedItem] = newSectionOrder.splice(result.source.index, 1);
    newSectionOrder.splice(result.destination.index, 0, movedItem);
    
    // Check if new order maintains ATS compatibility
    if (isAtsCompatible(newSectionOrder)) {
      applyNewOrder(newSectionOrder);
    } else {
      // Store the attempted order and show warning
      setAttemptedReorder(newSectionOrder);
      setOrderWarningOpen(true);
    }
  };
  
  // Apply the new section order
  const applyNewOrder = (newOrder: ResumeSectionType[]) => {
    onSectionsReordered(newOrder);
    
    // Scroll to the preview container to show changes
    if (previewContainerRef && previewContainerRef.current) {
      previewContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Apply the change despite ATS warning
  const applyNonAtsOrder = () => {
    applyNewOrder(attemptedReorder);
    setOrderWarningOpen(false);
  };
  
  return (
    <div className="mb-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="resume-sections">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {sections.map((section, index) => (
                <Draggable key={section} draggableId={section} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        flex items-center p-3 bg-white border rounded-md
                        ${atsRequiredSections.includes(section as ResumeSectionType) ? 'border-blue-200 bg-blue-50' : ''}
                      `}
                    >
                      <div {...provided.dragHandleProps} className="mr-3 text-gray-400">
                        <GripVertical size={18} />
                      </div>
                      <span className="font-medium">{sectionNames[section as ResumeSectionType]}</span>
                      {atsRequiredSections.includes(section as ResumeSectionType) && (
                        <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          ATS Required
                        </span>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* Alert dialog for ATS compatibility warning */}
      <AlertDialog open={orderWarningOpen} onOpenChange={setOrderWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="text-yellow-500 mr-2 h-5 w-5" />
              ATS Compatibility Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your requested section order may reduce ATS compatibility, which could make your resume less likely to pass through automated screening systems.
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                <strong>Recommendation:</strong> Keep all required sections in a standard order for best results.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep ATS Compatible</AlertDialogCancel>
            <AlertDialogAction onClick={applyNonAtsOrder} className="bg-yellow-600 hover:bg-yellow-700">
              Apply Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DraggableResumeSection;
