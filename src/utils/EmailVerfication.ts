import nodemailer from 'nodemailer';
import templateHTML from "./TemplateHTML";
require('dotenv').config();

class EmailVerification {
    private transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    public sendEmailVerification = async (email: string, token: string): Promise<{ message: string}> => {
        const mailOptions = {
            from: process.env.EMAIL_NAME,
            to: email,
            subject: 'Email Verification E-Learning Ilham',
            html: templateHTML.templateSendEmailVerification(token)
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err: any, info: any) => {
                if (err) reject({ message: "Kesalahan saat mengirimkan email" });
                resolve({ message: `Verification email sent in ${email}` });
            });
        });
    }
}

export default new EmailVerification();