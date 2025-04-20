
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Save } from 'lucide-react';
import useResumeStore, { CustomTemplate } from '@/hooks/useResumeStore';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SavedTemplates = () => {
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const { 
    customTemplates, 
    saveCustomTemplate, 
    applyCustomTemplate, 
    deleteCustomTemplate,
    currentResumeTemplate,
    currentSectionOrder
  } = useResumeStore();

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your template.",
        variant: "destructive"
      });
      return;
    }

    saveCustomTemplate(newTemplateName);
    setSaveDialogOpen(false);
    setNewTemplateName('');
    
    toast({
      title: "Template Saved",
      description: "Your custom template has been saved successfully.",
    });
  };

  const handleApplyTemplate = (template: CustomTemplate) => {
    applyCustomTemplate(template.id);
    
    toast({
      title: "Template Applied",
      description: `The template "${template.name}" has been applied.`,
    });
  };

  const handleDeleteTemplate = (template: CustomTemplate) => {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      deleteCustomTemplate(template.id);
      
      toast({
        title: "Template Deleted",
        description: `The template "${template.name}" has been removed.`,
      });
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Templates</h2>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Current Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
              <DialogDescription>
                Save your current template design and section order as a custom template.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="My Custom Template"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {customTemplates.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-gray-500">No saved templates yet.</p>
          <p className="text-sm text-gray-400 mt-1">Save your current template design for future use.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>
                  Created: {formatDate(template.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  <span className="font-medium">Base template:</span> {template.templateId}
                </div>
                <div className="text-sm mt-1">
                  <span className="font-medium">Sections:</span> {template.sectionOrder.length}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => handleDeleteTemplate(template)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTemplates;
