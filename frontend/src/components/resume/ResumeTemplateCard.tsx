
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResumeTemplateCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const ResumeTemplateCard: React.FC<ResumeTemplateCardProps> = ({
  id,
  name,
  description,
  image,
  selected,
  onSelect,
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="relative group">
        <img 
          src={image} 
          alt={name} 
          className="w-full aspect-[3/4] object-cover object-top" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <div className="flex flex-col items-center gap-2">
            <Button 
              variant={selected ? "secondary" : "default"}
              className="rounded-full"
              onClick={() => onSelect(id)}
            >
              {selected ? (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Selected
                </>
              ) : (
                "Use this template"
              )}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-white">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>ATS-friendly template</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    This template is optimized for Applicant Tracking Systems. You can customize section order while maintaining ATS compatibility.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {selected && (
          <div className="absolute top-2 right-2 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
            <CheckIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplateCard;
