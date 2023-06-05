import TicketService from '../services/tickets.services.js';

class TicketController {
    constructor () {
        this.ticketService = new TicketService();
    }
    
    generateTicket = async (req, res) => {
      try {
        const ticketData = req.body;
        const userId = req.user._id
        ticketData.purchaser = userId;
        const ticket = await this.ticketService.generateTicket(ticketData);
        res.json({ ticket: ticket });
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
    }
}

export default TicketController;