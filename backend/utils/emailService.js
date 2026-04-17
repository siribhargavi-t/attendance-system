const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        // ✅ Check env variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email credentials missing in .env");
        }

        // ✅ Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ Verify connection (very useful for debugging)
        await transporter.verify();

        const mailOptions = {
            from: `"AttendPro" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,

            // ✅ Optional: HTML support (better emails)
            html: `<p>${text}</p>`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent:", info.messageId);
        return true;

    } catch (err) {
        console.error("❌ Email error:", err.message);
        return false;
    }
};

module.exports = { sendEmail };