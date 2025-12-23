import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

import { departments } from "@/data/departments";

const formSchema = z.object({
  department: z.string().min(1, { message: "Selecione um departamento" }),
  name: z.string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  subject: z.string()
    .min(5, { message: "Assunto deve ter pelo menos 5 caracteres" })
    .max(200, { message: "Assunto deve ter no máximo 200 caracteres" }),
  message: z.string()
    .min(10, { message: "Mensagem deve ter pelo menos 10 caracteres" })
    .max(2000, { message: "Mensagem deve ter no máximo 2000 caracteres" }),
});

declare global {
  interface Window {
    Email: any;
  }
}

const loadEmailScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Email) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://smtpjs.com/v3/smtp.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o script de envio de email. Verifique sua conexão."));
    document.head.appendChild(script);
  });
};

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    const handlePreselectDepartment = (event: CustomEvent<{ email: string }>) => {
      const departmentEmail = event.detail.email;
      const departmentExists = departments.find(d => d.email === departmentEmail);

      if (departmentExists) {
        form.setValue("department", departmentEmail);

        setTimeout(() => {
          const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
          if (nameInput) {
            nameInput.focus();
          }
        }, 100);
      }
    };

    window.addEventListener('preselectDepartment', handlePreselectDepartment as EventListener);

    return () => {
      window.removeEventListener('preselectDepartment', handlePreselectDepartment as EventListener);
    };
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      await loadEmailScript();

      const departmentData = departments.find(d => d.email === values.department);
      const departmentLabel = departmentData?.title || "";

      const response = await window.Email.send({
        Host: "mail.smtp2go.com",
        Username: "ifpr.edu.br",
        Password: "hgMQ9vYyODcyYlPk",
        Port: "2525",
        To: values.department,
        From: "comunicacao.assis@ifpr.edu.br",
        Subject: values.subject,
        Body: `
          <h3>Nova Mensagem de Contato - IFPR</h3>
          <p><strong>Departamento:</strong> ${departmentLabel}</p>
          <p><strong>Nome:</strong> ${values.name}</p>
          <p><strong>Email:</strong> ${values.email}</p>
          <p><strong>Assunto:</strong> ${values.subject}</p>
          <hr/>
          <p><strong>Mensagem:</strong></p>
          <p>${values.message.replace(/\n/g, "<br>")}</p>
        `
      });

      if (response !== "OK") {
        throw new Error(response);
      }

      toast.success("Mensagem enviada com sucesso!", {
        description: "O departamento receberá sua mensagem em breve.",
      });

      form.reset();

    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar mensagem", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id="contact-form" className="mt-10 shadow-lg animate-fade-in-up scroll-mt-6">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-primary">Entre em Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="" disabled>Selecione o departamento</option>
                      {departments.map((dept) => (
                        <option key={dept.email} value={dept.email}>
                          {dept.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Assunto da sua mensagem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua mensagem aqui..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando mensagem...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
