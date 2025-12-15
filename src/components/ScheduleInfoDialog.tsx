import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Info, Search, User, BookOpen, MapPin, Users, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

interface Aula {
  dia: string;
  disciplina: string;
  sala: string;
  turma: string;
}

interface Professor {
  nome: string;
  aulas: Aula[];
}

interface ScheduleData {
  success: boolean;
  lastUpdated: string;
  data: Professor[];
  totalProfessores: number;
  totalAulas: number;
}

export const ScheduleInfoDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const fetchScheduleInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-schedule-info');
      
      if (error) throw error;
      
      setScheduleData(data);
      setLastFetchTime(new Date());
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error("Erro ao buscar informações de horários");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && !scheduleData) {
      fetchScheduleInfo();
    }
  }, [open]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      fetchScheduleInfo();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [open]);

  const filteredData = scheduleData?.data.filter(professor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      professor.nome.toLowerCase().includes(searchLower) ||
      professor.aulas.some(
        aula =>
          aula.disciplina.toLowerCase().includes(searchLower) ||
          aula.turma.toLowerCase().includes(searchLower) ||
          aula.sala.toLowerCase().includes(searchLower)
      )
    );
  });

  const getDayColor = (dia: string) => {
    const colors: Record<string, string> = {
      'Segunda': 'bg-blue-500/20 text-blue-700 border-blue-300',
      'Terça': 'bg-green-500/20 text-green-700 border-green-300',
      'Quarta': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      'Quinta': 'bg-purple-500/20 text-purple-700 border-purple-300',
      'Sexta': 'bg-red-500/20 text-red-700 border-red-300',
    };
    return colors[dia] || 'bg-muted text-muted-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-primary/30 hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 font-semibold text-primary gap-2"
        >
          <Info className="w-5 h-5" />
          Informações Gerais
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Informações Gerais - Grade de Horários
          </DialogTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por docente, disciplina, turma ou sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              {lastFetchTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Atualizado: {lastFetchTime.toLocaleTimeString('pt-BR')}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchScheduleInfo}
                disabled={loading}
                className="gap-1"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] p-6">
          {loading && !scheduleData ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando informações...</p>
              </div>
            </div>
          ) : scheduleData?.success ? (
            <div className="space-y-4">
              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{scheduleData.totalProfessores}</p>
                      <p className="text-sm text-muted-foreground">Docentes</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{scheduleData.totalAulas}</p>
                      <p className="text-sm text-muted-foreground">Aulas Cadastradas</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Professors List */}
              <div className="space-y-4">
                {filteredData?.map((professor, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-3">
                          {professor.nome}
                        </h3>
                        <div className="grid gap-2">
                          {professor.aulas.map((aula, aulaIndex) => (
                            <div 
                              key={aulaIndex} 
                              className="flex flex-wrap items-center gap-2 p-2 bg-muted/50 rounded-lg"
                            >
                              <Badge variant="outline" className={`${getDayColor(aula.dia)} border`}>
                                {aula.dia}
                              </Badge>
                              <span className="font-medium text-foreground">{aula.disciplina}</span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {aula.sala}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {aula.turma}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredData?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Erro ao carregar dados. Tente novamente.</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-muted/30 text-center text-xs text-muted-foreground">
          Dados atualizados automaticamente a cada 5 minutos • 
          Fonte: <a href="https://horario-ifpr-assis-chateaubriand.netlify.app/docs/intro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sistema de Horários IFPR</a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
