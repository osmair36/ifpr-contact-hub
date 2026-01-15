export interface EmailParams {
    department: string;
    departmentLabel: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    [key: string]: unknown;
}

export const sendEmail = async (templateParams: EmailParams) => {
    const API_KEY = "api-9D07C68DB6F94997B96DFD50FC81DFC8";
    // Format: "Name <email>"
    const SENDER_EMAIL = "Fale Conosco <rtic.assischateaubriand@ifpr.edu.br>";

    // Validar se o departamento (recipient) é um email válido
    if (!templateParams.department || !templateParams.department.includes('@')) {
        throw new Error("Email do departamento inválido.");
    }

    const payload = {
        api_key: API_KEY,
        to: [templateParams.department],
        sender: SENDER_EMAIL,
        subject: `[Fale Conosco] ${templateParams.subject}`,
        html_body: `
            <h2>Nova mensagem do Fale Conosco - IFPR Campus Assis Chateaubriand</h2>
            <p><strong>Departamento:</strong> ${templateParams.departmentLabel}</p>
            <p><strong>Nome:</strong> ${templateParams.name}</p>
            <p><strong>Email do Remetente:</strong> ${templateParams.email}</p>
            <p><strong>Assunto:</strong> ${templateParams.subject}</p>
            <hr />
            <h3>Mensagem:</h3>
            <p>${templateParams.message.replace(/\n/g, '<br>')}</p>
            <hr />
            <p><small>Este email foi enviado pelo formulário Fale Conosco.</small></p>
        `,
        custom_headers: [
            {
                "header": "Reply-To",
                "value": `${templateParams.name} <${templateParams.email}>`
            }
        ]
    };

    try {
        console.log("Iniciando envio via SMTP2GO...");
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Tenta fazer o parse do JSON, mas previne falha se não for JSON
        let data;
        const responseText = await response.text();
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Erro ao fazer parse da resposta do SMTP2GO:", responseText);
            throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 50)}...`);
        }

        if (!response.ok || (data.data && data.data.error)) {
            console.error("Erro API SMTP2GO (Response):", data);
            const errorMsg = data.data?.error || data.data?.error_code || "Falha desconhecida no envio.";
            throw new Error(`SMTP2GO Error: ${errorMsg}`);
        }

        console.log("Email enviado com sucesso!", data);
        return data;
    } catch (error) {
        console.error("Erro detalhado no serviço de email:", error);
        throw error;
    }
};
