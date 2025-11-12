import { ExternalLink, Mail, Clock, Users, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoursDialog } from "./HoursDialog";

interface DepartmentCardProps {
  title: string;
  email: string;
  hours: string;
  team: string[];
  link: string;
  icon: LucideIcon;
}

export const DepartmentCard = ({ title, email, hours, team, link, icon: Icon }: DepartmentCardProps) => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      setTimeout(() => {
        const event = new CustomEvent('preselectDepartment', { 
          detail: { email } 
        });
        window.dispatchEvent(event);
      }, 600);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3 text-primary group">
          <span className="flex-1 flex items-center gap-3 group-hover:scale-105 transition-transform">
            <Icon className="w-6 h-6 shrink-0" />
            {title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-accent hover:text-accent-foreground"
            onClick={() => window.open(link, '_blank')}
            aria-label={`Abrir página de ${title}`}
          >
            <ExternalLink className="w-5 h-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4 shrink-0" />
          <button 
            onClick={handleEmailClick}
            className="hover:text-primary transition-colors break-all text-left cursor-pointer"
          >
            {email}
          </button>
        </div>
        <HoursDialog hours={hours} departmentTitle={title}>
          <button className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors group w-full text-left">
            <Clock className="w-4 h-4 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <span className="flex-1">{hours}</span>
          </button>
        </HoursDialog>
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 font-semibold mb-2 text-foreground">
            <Users className="w-4 h-4" />
            <span>Equipe:</span>
          </div>
          <div className="space-y-1.5 ml-6">
            {team.map((member, index) => (
              <p 
                key={index}
                className="text-sm text-muted-foreground hover:text-accent hover:scale-105 transition-all cursor-default"
              >
                {member}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
