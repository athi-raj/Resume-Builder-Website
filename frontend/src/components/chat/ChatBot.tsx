
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import useResumeStore from '@/hooks/useResumeStore';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your resume assistant. How can I help you today?',
    isUser: false,
    timestamp: new Date(),
  },
];

// Resume-related keywords for improved AI responses
const resumeKeywords = [
  'resume', 'cv', 'template', 'format', 'section', 'experience', 'education',
  'skills', 'projects', 'certifications', 'summary', 'header', 'contact',
  'ats', 'applicant tracking system', 'job', 'career', 'professional',
  'customize', 'edit', 'save', 'download', 'export', 'print', 'share'
];

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    currentResumeTemplate, 
    setCurrentResumeTemplate, 
    currentSectionOrder,
    setSectionOrder,
    saveCustomTemplate
  } = useResumeStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // More sophisticated response generation with contextual awareness
  const generateResponse = async (message: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercaseMessage = message.toLowerCase();
    
    // Check if message contains resume-related keywords
    const isResumeRelated = resumeKeywords.some(keyword => 
      lowercaseMessage.includes(keyword)
    );
    
    let response: string;
    let actions = [];
    
    // Template-specific questions
    if (lowercaseMessage.includes('template') || lowercaseMessage.includes('design')) {
      if (lowercaseMessage.includes('recommend') || lowercaseMessage.includes('suggest') || lowercaseMessage.includes('which')) {
        response = "I'd recommend trying the Modern template for tech roles, Creative for design positions, or Classic for traditional industries. Would you like to switch to one of these templates?";
        actions = [
          { 
            label: 'Switch to Modern', 
            action: () => {
              setCurrentResumeTemplate('modern');
              toast({
                title: "Template Updated",
                description: "Your resume now uses the Modern template.",
              });
            }
          },
          { 
            label: 'Switch to Creative', 
            action: () => {
              setCurrentResumeTemplate('creative');
              toast({
                title: "Template Updated",
                description: "Your resume now uses the Creative template.",
              });
            } 
          },
          { 
            label: 'Switch to Classic', 
            action: () => {
              setCurrentResumeTemplate('classic');
              toast({
                title: "Template Updated",
                description: "Your resume now uses the Classic template.",
              });
            } 
          }
        ];
      } else if (lowercaseMessage.includes('save') || lowercaseMessage.includes('store') || lowercaseMessage.includes('keep')) {
        response = "You can save your current template with its customizations for future use. Would you like to save your current template?";
        actions = [
          { 
            label: 'Save Current Template', 
            action: () => {
              const templateName = prompt("Please name your custom template:");
              if (templateName) {
                saveCustomTemplate(templateName);
                toast({
                  title: "Template Saved",
                  description: `Your custom template "${templateName}" has been saved.`,
                });
              }
            } 
          }
        ];
      } else {
        response = "Our templates are designed for maximum ATS compatibility while still looking professional. You can customize the order of sections by dragging and dropping them in the editor.";
      }
    }
    // Section order questions
    else if (lowercaseMessage.includes('section') || lowercaseMessage.includes('order') || lowercaseMessage.includes('organize')) {
      response = "The order of your resume sections can significantly impact how recruiters perceive your qualifications. For most candidates, I recommend putting your strongest sections near the top. You can drag and drop sections to reorder them.";
      
      // Show option to navigate to the builder
      if (lowercaseMessage.includes('how') || lowercaseMessage.includes('can i')) {
        actions = [
          { 
            label: 'Go to Resume Editor', 
            action: () => navigate('/builder') 
          }
        ];
      }
    }
    // ATS-related questions
    else if (lowercaseMessage.includes('ats') || (lowercaseMessage.includes('applicant') && lowercaseMessage.includes('tracking'))) {
      response = "ATS (Applicant Tracking Systems) scan resumes for keywords and formatting. Our templates are ATS-friendly, but you should ensure you include relevant keywords from the job description. The Personal Information, Experience, Education, and Skills sections are particularly important for ATS scanning.";
    }
    // How to export/download
    else if (lowercaseMessage.includes('download') || lowercaseMessage.includes('export') || lowercaseMessage.includes('pdf') || lowercaseMessage.includes('print')) {
      response = "You can download your resume as a PDF from the preview page. Look for the download button at the top of the page. This will generate a high-quality PDF document ready to send to employers.";
      actions = [
        { 
          label: 'Go to Preview', 
          action: () => navigate('/preview') 
        }
      ];
    }
    // General resume advice
    else if (isResumeRelated) {
      const adviceResponses = [
        "Make sure your resume highlights your most relevant skills and experience for the specific job you're applying to.",
        "A concise professional summary can really make your resume stand out. Focus on your key strengths and career goals.",
        "Quantify your achievements with numbers when possible, e.g., 'Increased sales by 25%' rather than 'Increased sales significantly'.",
        "Keep your resume to 1-2 pages maximum. Most recruiters only spend about 6-7 seconds on the initial scan.",
        "Update your contact information to make it easy for employers to reach you. A professional email address is important.",
        "Tailoring your resume for each application by including relevant keywords from the job posting can improve your chances.",
        "For technical roles, include a skills section that clearly outlines your technical proficiencies.",
      ];
      
      response = adviceResponses[Math.floor(Math.random() * adviceResponses.length)];
    }
    // Default fallback response
    else {
      const generalResponses = [
        "I'm here to help with your resume. You can ask me about templates, section organization, ATS compatibility, or general resume advice.",
        "Feel free to ask specific questions about your resume, such as how to improve your experience section or choose the best template for your industry.",
        "What specific aspect of resume building can I assist you with today?",
        "Is there a particular section of your resume you're struggling with? I'd be happy to provide some guidance.",
      ];
      
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      actions: actions.length > 0 ? actions : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    generateResponse(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleChat = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Give time for the sheet to open before scrolling
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleChat}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="rounded-full fixed bottom-6 right-6 shadow-lg h-14 w-14 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <SheetTitle>Resume Assistant</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.actions.map((action, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          onClick={action.action}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;
