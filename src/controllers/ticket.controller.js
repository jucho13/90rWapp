import {ticketService} from '../services/factory.js'

const ticketController = async (req, res) => {
    const tid = req.params.tid;
    const ticketData = await ticketService.loadTicket({_id:tid});
    res.render('ticket', { ticket: ticketData });
}
const ticketControllerPost = async (req, res) => {
    const tid = req.body;
    const user = req.session.user;
    const ticketData = await ticketService.createTicket(tid,user);
    res.render('ticket', { ticket: ticketData });
}
const verCarritoController = async (req, res) => {
    const user= req.session.user;
    console.log(user);
    res.render('cartView' ,{user: user});
}

export { ticketController,ticketControllerPost, verCarritoController }