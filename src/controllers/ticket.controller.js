import {ticketService} from '../services/factory.js'

const ticketController = async (req, res) => {
    const purchaser = req.user.email;
    // console.log(`purchaser ${purchaser}`);
    const ticketData = await ticketService.findTicketByPurchaser(purchaser);
    // console.log(ticketData);
    res.render('ticket', {ticket: ticketData });
}
const ticketControllerPost = async (req, res) => {
    const cid = req.body.valorDeseado;
    const user = req.session.user;
    // console.log(user);
    // console.log(`cid ${cid}`);
    // console.log(`user ${user}`);
    const ticketData = await ticketService.createTicket(cid,user);
    // console.log(`TICKET DATA: ${ticketData}`);
    // console.log(`new session user ${req.session.user.ticketId}`);  
    res.redirect("/ticket/vistas");
}
const verCarritoController = async (req, res) => {
    const user= req.session.user;
    // console.log(user);
    res.render('cartView' ,{user: user});
}

export { ticketController, verCarritoController, ticketControllerPost}