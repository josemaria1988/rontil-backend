import ticketsRepository from '../dao/repositories/tickets.repository.js'

class TicketService {
  generateTicket = async (ticketData) => {
    try {
      const { purchaser, amount } = ticketData;

      const ticket = new ticketsRepository({
        code: generateUniqueCode(),
        purchaser: purchaser,
        amount: amount,
      });

      const savedTicket = await ticket.save();
      return savedTicket;
    } catch (error) {
      console.error(error);
      throw new Error('Error al generar el ticket');
    }
  };
}

export default TicketService;