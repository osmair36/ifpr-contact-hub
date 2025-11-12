import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HoursDialogProps {
  hours: string;
  departmentTitle: string;
  children: ReactNode;
}

const parseHours = (hoursText: string) => {
  // Parse various hour formats and return structured data
  const weekdayMatch = hoursText.match(/(Segunda|Segunda-feira|Segunda a sexta|Segunda a Sexta-Feira)/i);
  
  // Extract time ranges
  const timeRanges: Array<{ start: string; end: string }> = [];
  const timePattern = /(\d{1,2}):(\d{2})\s*(?:às|a|até)\s*(\d{1,2}):(\d{2})/g;
  let match;
  
  while ((match = timePattern.exec(hoursText)) !== null) {
    timeRanges.push({
      start: `${match[1]}:${match[2]}`,
      end: `${match[3]}:${match[4]}`,
    });
  }
  
  return { hasWeekdays: !!weekdayMatch, timeRanges };
};

const isTimeInRange = (hour: number, minute: number, start: string, end: string) => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  const currentMinutes = hour * 60 + minute;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

export const HoursDialog = ({ hours, departmentTitle, children }: HoursDialogProps) => {
  const { hasWeekdays, timeRanges } = parseHours(hours);
  
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const weekendDays = ["Sábado", "Domingo"];
  const allDays = [...weekDays, ...weekendDays];
  
  // Generate hours from 7:00 to 23:00
  const hoursRange = Array.from({ length: 17 }, (_, i) => i + 7);
  
  const isWorkingDay = (day: string) => {
    if (!hasWeekdays) return false;
    return weekDays.includes(day);
  };
  
  const getCellStatus = (day: string, hour: number) => {
    if (!isWorkingDay(day)) return "closed";
    
    for (const range of timeRanges) {
      if (isTimeInRange(hour, 0, range.start, range.end)) {
        return "open";
      }
    }
    
    return "closed";
  };
  
  const getCellColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-primary/20 border-primary/40 hover:bg-primary/30";
      case "closed":
        return "bg-muted/30 border-border/30";
      default:
        return "bg-background";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            Horário de Atendimento - {departmentTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-foreground">{hours}</p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="font-semibold text-sm text-center p-2">Horário</div>
                {allDays.map((day) => (
                  <div 
                    key={day} 
                    className={`font-semibold text-sm text-center p-2 rounded-t ${
                      isWorkingDay(day) ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="space-y-1">
                {hoursRange.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-1">
                    <div className="text-sm font-medium text-center p-2 bg-muted/30 rounded flex items-center justify-center">
                      {hour}:00
                    </div>
                    {allDays.map((day) => {
                      const status = getCellStatus(day, hour);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`p-2 rounded border-2 transition-all ${getCellColor(status)}`}
                          title={`${day} ${hour}:00 - ${status === 'open' ? 'Aberto' : 'Fechado'}`}
                        >
                          <div className="w-full h-6 flex items-center justify-center">
                            {status === 'open' && (
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 bg-primary/20 border-primary/40" />
                  <span className="text-sm">Aberto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 bg-muted/30 border-border/30" />
                  <span className="text-sm">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
