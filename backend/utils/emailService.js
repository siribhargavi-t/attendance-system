const nodemailer = require("nodemailer");

let cachedTransporter = null;

const getTransporter = async () => {
    if (cachedTransporter) return cachedTransporter;

    if (process.env.EMAIL_SERVICE === "ethereal") {
        console.log("🔧 Generating Ethereal Email test account...");
        const testAccount = await nodemailer.createTestAccount();
        cachedTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        cachedTransporter.isEthereal = true;
        return cachedTransporter;
    }

    // Standard SMTP / Gmail
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials missing in .env");
    }

    cachedTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    return cachedTransporter;
};

const sendEmail = async (to, subject, text) => {
    // Execute sending in the background (fire-and-forget) so it does not block the caller
    getTransporter()
        .then(transporter => {
            const fromEmail = transporter.isEthereal ? "test@ethereal.email" : process.env.EMAIL_USER;

            const mailOptions = {
                from: `"AttendPro" <${fromEmail}>`,
                to,
                subject,
                text,
                html: `<p>${text}</p>`,
            };

            return transporter.sendMail(mailOptions).then(info => {
                console.log("✅ Email sent:", info.messageId);
                if (transporter.isEthereal) {
                    const previewUrl = nodemailer.getTestMessageUrl(info);
                    console.log("✉️ Ethereal Email Preview URL:", previewUrl);
                }
            });
        })
        .catch(err => {
            console.error("❌ Asynchronous email error:", err.message);
        });

    // Return true immediately to keep the server/API response instantaneous
    return true;
};

module.exports = { sendEmail };