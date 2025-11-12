import { ReactNode } from "react";
import { Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface TeamDialogProps {
  team: string[];
  departmentTitle: string;
  children: ReactNode;
}

export const TeamDialog = ({ team, departmentTitle, children }: TeamDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
          <DialogTitle className="text-3xl text-primary flex items-center gap-3 pr-8">
            <Users className="w-8 h-8" />
            Equipe - {departmentTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground leading-snug">
                    {member}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <DialogClose asChild>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
                Fechar
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
