

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  department: string;
  departmentLabel: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { department, departmentLabel, name, email, subject, message }: ContactEmailRequest = await req.json();

    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525,
      auth: {
        user: "ifpr.edu.br",
        pass: "hgMQ9vYyODcyYlPk",
      },
    });

    await transporter.sendMail({
      from: "comunicacao.assis@ifpr.edu.br",
      to: department,
      replyTo: `${name} <${email}>`,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #1a5f3b; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
              .info-row { margin-bottom: 15px; }
              .label { font-weight: bold; color: #1a5f3b; }
              .message-box { background-color: white; padding: 20px; border-left: 4px solid #1a5f3b; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Nova Mensagem de Contato</h2>
                <p style="margin: 5px 0 0 0;">IFPR Campus Assis Chateaubriand</p>
              </div>
              <div class="content">
                <div class="info-row">
                  <span class="label">Departamento:</span> ${departmentLabel}
                </div>
                <div class="info-row">
                  <span class="label">Nome:</span> ${name}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> ${email}
                </div>
                <div class="info-row">
                  <span class="label">Assunto:</span> ${subject}
                </div>
                <div class="message-box">
                  <p style="margin: 0 0 10px 0;" class="label">Mensagem:</p>
                  <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
                <div class="footer">
                  <p>Esta mensagem foi enviada através do formulário de contato do site do IFPR Campus Assis Chateaubriand.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
