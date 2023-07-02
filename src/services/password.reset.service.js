import crypto from 'crypto';
import User from '../dao/repositories/users.repository.js';
import bcrypt from 'bcrypt';

class PasswordResetService {
  async createPasswordResetToken(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('No existe un usuario con ese correo electrónico');
    }

    const buffer = crypto.randomBytes(20);
    const resetToken = buffer.toString('hex');

    const now = new Date();
    const expires = new Date();
    expires.setHours(now.getHours() + 1); 

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;
    await user.save();

    return resetToken;
  }

  async resetPassword(token, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      throw new Error('El token de restablecimiento de contraseña es inválido o ha expirado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      throw new Error('La nueva contraseña no puede ser igual a la anterior');
    }

    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}

export default new PasswordResetService();