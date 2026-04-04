const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Mock sending using ethereal email
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Attendance System" <no-reply@ethereal.email>',
            to: to,
            subject: subject,
            text: text,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (err) {
        console.error("Email error: ", err);
        return false;
    }
};

module.exports = { sendEmail };
