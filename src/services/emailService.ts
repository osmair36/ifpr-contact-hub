import emailjs from '@emailjs/browser';

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
    // Credentials should be in .env
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        console.error("Credenciais do EmailJS ausentes. Verifique o arquivo .env.");
        console.log("Esperado: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY");
        // Throwing a friendly error for the UI
        throw new Error("Erro de configuração: Credenciais de email não encontradas.");
    }

    try {
        const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
        return response;
    } catch (error) {
        console.error("Erro ao enviar email via EmailJS:", error);
        throw new Error("Falha ao enviar o email. Tente novamente mais tarde.");
    }
};
