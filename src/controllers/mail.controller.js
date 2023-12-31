import nodemailer from 'nodemailer';
import { mailSettings } from '../config/nodemailer.config.js';

const transport = nodemailer.createTransport(mailSettings);

const sendEmail = async (req, res) => {
 try {
    let result = await transport.sendMail({
        from: 'Backend Jucho ',
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html,
        attachments: []
    });
    res.send(result);
} catch (error) {
    console.log(error);
}
}

export { sendEmail }