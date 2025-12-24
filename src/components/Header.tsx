import { Phone } from "lucide-react";
import { BackButton } from "./BackButton";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl shadow-lg p-10 mb-8 animate-fade-in-up">
      <div className="flex items-start gap-6 mb-6">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-3 animate-glow">
            Fale Conosco
          </h1>
          <p className="text-lg opacity-90">
            IFPR – Campus Assis Chateaubriand
          </p>
          <div className="flex items-center gap-2 mt-3 text-lg">
            <Phone className="w-5 h-5" />
            <span>(44) 3528-6885 ou (44) 98456-1883</span>
          </div>
        </div>
      </div>
    </header>
  );
};
