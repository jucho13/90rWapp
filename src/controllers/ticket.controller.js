import {ticketService} from '../services/factory.js'
import { cartService } from '../services/factory.js';
const ticketController = async (req, res) => {
    const tid = req.params.tid;
    const ticketData = await ticketService.loadTicket({_id:tid});
    res.render('ticket', { ticket: ticketData });
}
// const verCarritoController = async (req, res) => {
//     const user= req.session.user;
//     console.log(user);
//     const cartID= req.body;
//     const cart= await cartService.getCartbyID(cartID);
//     res.render('cartView' ,{user: user});
// }

export { ticketController }