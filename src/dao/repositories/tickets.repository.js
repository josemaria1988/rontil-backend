import mongoose from "mongoose";
import ticketSchema from '../schemas/ticket.model.js';

const ticketsCollection = "tickets";
const ticketsRepository = mongoose.model(ticketsCollection, ticketSchema);

export default ticketsRepository;