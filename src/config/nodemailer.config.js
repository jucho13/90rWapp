export const mailSettings = {
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.PASS_GMAIL
    }
}
