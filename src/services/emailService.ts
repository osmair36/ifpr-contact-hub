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
    const SENDER_EMAIL = "rtic.assischateaubriand@ifpr.edu.br";

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
            <h2>Nova mensagem do Fale Conosco</h2>
            <p><strong>Departamento:</strong> ${templateParams.departmentLabel}</p>
            <p><strong>Nome:</strong> ${templateParams.name}</p>
            <p><strong>Email do Remetente:</strong> ${templateParams.email}</p>
            <p><strong>Assunto:</strong> ${templateParams.subject}</p>
            <hr />
            <h3>Mensagem:</h3>
            <p>${templateParams.message.replace(/\n/g, '<br>')}</p>
            <hr />
            <p><small>Este email foi enviado automaticamente pelo sistema IFPR Contact Hub.</small></p>
        `,
        custom_headers: [
            {
                "header": "Reply-To",
                "value": templateParams.email
            }
        ]
    };

    try {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || (data.data && data.data.error)) {
            console.error("Erro API SMTP2GO:", data);
            throw new Error(data.data?.error || "Falha ao enviar email via SMTP2GO.");
        }

        return data;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        throw error;
    }
};
