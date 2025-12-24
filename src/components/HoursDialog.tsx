import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sunrise, Sun, Moon, Calendar } from "lucide-react";

interface HoursDialogProps {
  hours: string;
  departmentTitle: string;
  children: ReactNode;
}

const parseHours = (hoursText: string) => {
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

  // Detect days
  const weekdayMatch = hoursText.match(/(Segunda|Segunda-feira|Segunda a sexta|Segunda a Sexta-Feira)/i);
  const days = weekdayMatch ? "Segunda a Sexta-feira" : "Consulte o horário";

  return { timeRanges, days };
};

const splitIntoPeriods = (timeRanges: Array<{ start: string; end: string }>) => {
  const periods: { morning?: string; afternoon?: string; continuous?: string } = {};

  if (timeRanges.length === 0) return periods;

  if (timeRanges.length === 1) {
    // Single continuous period
    periods.continuous = `${timeRanges[0].start} - ${timeRanges[0].end}`;
  } else if (timeRanges.length >= 2) {
    // Morning and afternoon periods
    periods.morning = `${timeRanges[0].start} - ${timeRanges[0].end}`;
    periods.afternoon = `${timeRanges[1].start} - ${timeRanges[1].end}`;
  }

  return periods;
};

export const HoursDialog = ({ hours, departmentTitle, children }: HoursDialogProps) => {
  const { timeRanges, days } = parseHours(hours);
  const periods = splitIntoPeriods(timeRanges);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Horário de Atendimento
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-center font-semibold text-lg text-primary">{departmentTitle}</p>
            <p className="text-center text-sm text-muted-foreground mt-1">{hours}</p>
          </div>

          {periods.continuous ? (
            // Single continuous period
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  <Sun className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">HORÁRIO DE ATENDIMENTO</h3>
                <p className="text-5xl font-bold text-center my-6">{periods.continuous}</p>
                <p className="text-center text-lg opacity-90">{days}</p>
              </div>
            </div>
          ) : (
            // Morning and afternoon periods
            <div className="grid md:grid-cols-2 gap-6">
              {periods.morning && (
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-4">
                    <Sunrise className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">MANHÃ</h3>
                  <p className="text-5xl font-bold text-center my-6">{periods.morning}</p>
                  <p className="text-center text-lg opacity-90">{days}</p>
                </div>
              )}

              {periods.afternoon && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-4">
                    <Sun className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">TARDE</h3>
                  <p className="text-5xl font-bold text-center my-6">{periods.afternoon}</p>
                  <p className="text-center text-lg opacity-90">{days}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              💡 <strong>Dica:</strong> Para melhor atendimento, recomendamos agendar previamente por e-mail.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
