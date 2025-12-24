import { Header } from "@/components/Header";
import { DepartmentCard } from "@/components/DepartmentCard";
import { ContactForm } from "@/components/ContactForm";
import { BackButton } from "@/components/BackButton";
import { departments } from "@/data/departments";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={index}
              title={dept.title}
              email={dept.email}
              hours={dept.hours}
              team={dept.team}
              link={dept.link}
              icon={dept.icon}
            />
          ))}
        </div>

        <Card className="mb-10 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 animate-fade-in-up">
          <a
            href="https://horario-ifpr-assis-chateaubriand.netlify.app/docs/intro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 text-primary font-bold text-xl hover:text-accent transition-all hover:scale-105 transform duration-300"
          >
            <Calendar className="w-6 h-6" />
            Horários de Aulas e Atendimento dos Professores
          </a>
        </Card>

        <ContactForm />

        <div className="mt-10 flex justify-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default Index;
