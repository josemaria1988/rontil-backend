import TicketService from '../services/tickets.services.js';

class TicketController {
    constructor () {
        this.ticketService = new TicketService();
    }
    
    generateTicket = async (req, res) => {
      try {
        const ticketData = req.body;
        const ticket = await ticketService.generateTicket(ticketData);
        res.json({ ticket: ticket });
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
    }
}

export default TicketController;