import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { department, departmentLabel, name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Sending email via SMTP2GO API:", { department, name, email, subject });

    const smtp2goApiKey = Deno.env.get("SMTP2GO_API_KEY");
    
    if (!smtp2goApiKey) {
      throw new Error("SMTP2GO_API_KEY not configured");
    }

    // Enviar email para o departamento usando API do SMTP2GO
    const emailResponse = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": smtp2goApiKey,
      },
      body: JSON.stringify({
        sender: "noreply@ifpr.edu.br",
        to: [department],
        subject: subject,
        html_body: `
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
        custom_headers: [
          {
            header: "Reply-To",
            value: `${name} <${email}>`,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("SMTP2GO API error:", errorData);
      throw new Error(`SMTP2GO API error: ${emailResponse.status} - ${errorData}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully via SMTP2GO API:", emailData);

    return new Response(
      JSON.stringify({ success: true, data: emailData.data }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
