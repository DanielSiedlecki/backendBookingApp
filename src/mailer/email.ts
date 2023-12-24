const hbs = require('nodemailer-express-handlebars');
import * as nodemailer from "nodemailer";
import * as path from "path";

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./mailer/templates/"),
        defaultLayout: false,
    },
    viewPath: path.resolve("./mailer/templates/"),
    extName: ".handlebars",
};

interface ExtendedMailOptions extends nodemailer.SendMailOptions {
    template?: string;
    context?: any;
}

const sendEmail = async (email: string, subject: string, template: string, context: Object) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        transporter.use("compile", hbs(handlebarOptions));

        const mailOptions: ExtendedMailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            template: template,
            context: context
        };
        await transporter.sendMail(mailOptions);
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent");
        console.error(error);
    }
};

export default sendEmail;