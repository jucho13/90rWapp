import {ticketService} from '../services/factory.js'
const ticketController = async (req, res) => {
    const tid = req.params.tid;
    const ticketData = await ticketService.loadTicket(tid);
    res.render('ticket', { ticket: ticketData });
}

export { ticketController }