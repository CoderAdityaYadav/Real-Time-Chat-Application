import { resendClient,sender } from "../lib/resend.js";
import {createWelcomeEmailTemplate} from "../emails/emailTemplates.js"

export async function sendWelcomeEmail(toEmail, toName, clientURL) {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: toEmail,
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(toName, clientURL),
    })
    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    } else {
        console.log("Welcome Email sent successfully", data);
    }
} 