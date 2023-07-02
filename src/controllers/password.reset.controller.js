import PasswordResetService from '../services/password.reset.service.js';
import EmailService from '../services/email.services.js';

const emailService = new EmailService();

class PasswordResetController {
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email no proporcionado' });
                return;
            }
            const resetToken = await PasswordResetService.createPasswordResetToken(email);

            const subject = 'Restablecimiento de contraseña';
            const htmlContent = `
            <h1>Has solicitado restablecer tu contraseña</h1>
            <p>Por favor, haz click en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="http://localhost:8080/api/newPass/reset-password/${resetToken}">Restablecer contraseña</a>
            <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo electrónico</p>
          `;

            await emailService.sendPasswordResetEmail(email, subject, htmlContent);

            res.json({ message: 'Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password, confirmPassword } = req.body;

            await PasswordResetService.resetPassword(token, password, confirmPassword);

            res.json({ message: 'Contraseña actualizada con éxito' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}

export default new PasswordResetController();