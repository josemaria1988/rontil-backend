import ticketsRepository from '../dao/repositories/tickets.repository.js'
import { v4 as uuidv4 } from 'uuid';
import EmailService from './email.services.js';

class TicketService {
  constructor() {
    this.emailService = new EmailService()
  }
  generateTicket = async (ticketData) => {
    try {
      const { purchaser, amount, availableProducts } = ticketData;

      const ticket = new ticketsRepository({
        code: uuidv4(),
        purchaser: purchaser,
        amount: amount,
        products: availableProducts
      });

      const savedTicket = await ticket.save();
      const populatedTicket = await ticketsRepository.findById(savedTicket._id).populate('products.product');

      // Enviar el correo electrónico con el ticket
      await this.emailService.sendPurchaseEmail(
        purchaser,
        `Tu compra ha sido confirmada con éxito! Código de ticket ${populatedTicket.code}.`,
        populatedTicket
      );

      return populatedTicket;
    } catch (error) {
      console.error(error);
      throw new Error('Error al generar el ticket');
    }
  };

  getTicket = async (userEmail) => {
    try {
      const ticket = await ticketsRepository.findOne({ purchaser: userEmail }).populate('products.product');
      return ticket;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default TicketService;