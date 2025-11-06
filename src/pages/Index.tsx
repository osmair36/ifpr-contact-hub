import { Header } from "@/components/Header";
import { DepartmentCard } from "@/components/DepartmentCard";
import { ContactForm } from "@/components/ContactForm";
import { departments } from "@/data/departments";
import { Calendar } from "lucide-react";

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
            />
          ))}
        </div>

        <ContactForm />

        <div className="text-center mt-10 animate-fade-in-up">
          <a
            href="https://ifpr.edu.br/assis-chateaubriand/menu-academico/horarios/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:text-accent transition-colors hover:scale-105 transform duration-300"
          >
            <Calendar className="w-5 h-5" />
            Horários de Aulas e Atendimento dos Professores - Clique aqui
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
