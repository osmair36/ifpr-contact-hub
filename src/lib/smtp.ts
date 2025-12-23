export interface EmailData {
    Host?: string;
    Username?: string;
    Password?: string;
    To: string;
    From: string;
    Subject: string;
    Body: string;
    Port?: string;
}

export const sendEmail = async (data: EmailData): Promise<string> => {
    const formData = new URLSearchParams();
    if (data.Host) formData.append("Host", data.Host);
    if (data.Username) formData.append("Username", data.Username);
    if (data.Password) formData.append("Password", data.Password);
    if (data.Port) formData.append("Port", data.Port);
    formData.append("To", data.To);
    formData.append("From", data.From);
    formData.append("Subject", data.Subject);
    formData.append("Body", data.Body);
    formData.append("Action", "Send");

    await fetch("https://smtpjs.com/v3/smtpjs.aspx", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    return "OK";
};
