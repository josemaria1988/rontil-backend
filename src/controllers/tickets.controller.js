import TicketService from '../services/tickets.services.js';
import CartService from '../services/carts.services.js';

class TicketController {
    constructor () {
        this.ticketService = new TicketService();
        this.cartService = new CartService();
    }
    
    generateTicket = async (req, res) => {
      try {
        const ticketData = req.body;
        const userEmail = req.user.email;
        ticketData.purchaser = userEmail;
        const ticket = await this.ticketService.generateTicket(ticketData);
        await this.cartService.clearCart(req.user._id)
        res.json({ ticket: ticket });
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
    }
}

export default TicketController;