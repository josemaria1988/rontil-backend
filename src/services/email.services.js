import nodemailer from "nodemailer";
import config from "../config.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.nodemailerService,
      port: config.nodemailerPort,
      auth: {
        user: config.nodemailerUser,
        pass: config.nodemailerPass,    
      },
    });
  }

  sendPurchaseEmail = async (purchaser, subject, ticket) => {
    let productsHTML = '';

    // Recorre el array de productos y genera el HTML para cada uno
    ticket.products.forEach(productObj => {
      const product = productObj.product;
      productsHTML += `
        <p>Producto: ${product.title}</p>
        <p>Cantidad: ${productObj.quantity}</p>
        <p>Precio: ${productObj.price}</p>
      `;
    });

    const info = await this.transporter.sendMail({
      from: config.nodemailerUser,
      to: purchaser,
      subject: subject,
      html: `
        <h1> Muchas gracias por tu compra! </h1>

        <h3> Aquí te dejamos el detalle de la misma </h3>
        <p> Codigo: ${ticket.code}</p>
        ${productsHTML}
        <p> Fecha: ${ticket.purchase_datetime}</p>
        <p> Monto: ${ticket.amount}</p>
      `,
      attachments: [] // aquí parece que hubo un error de tipeo, debería ser 'attachments', no 'attachment'
    });

    console.log("Message sent: %s", info.messageId);
  };

  sendPasswordResetEmail = async (recipient, subject, htmlContent) => {
    const info = await this.transporter.sendMail({
      from: config.nodemailerUser,
      to: recipient,
      subject: 'Restablecimiento de contraseña',
      html: htmlContent
    });

    console.log("Message sent: %s", info.messageId);
  };
}

export default EmailService;