import ticketsRepository from '../dao/repositories/tickets.repository.js'
import { v4 as uuidv4 } from 'uuid';

class TicketService {
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
      return savedTicket;
    } catch (error) {
      console.error(error);
      throw new Error('Error al generar el ticket');
    }
  };

  getTicket = async (userEmail) => {
    try {
      const ticket = await ticketsRepository.findOne({purchaser: userEmail});
      return ticket
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default TicketService;