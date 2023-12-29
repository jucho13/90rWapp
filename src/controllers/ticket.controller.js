import {cartService, ticketService} from '../services/factory.js'

const ticketController = async (req, res) => {
    try {
        const cid = req.cookies['cart'];
        const user = req.session.user;
        console.log(`cid ${cid}`);
        console.log(`user ${user}`);
        const ticket = await ticketService.createTicket(cid, user);
        const tickete= JSON.parse(ticket);
        const ticketData= await ticketService.loadTicket(tickete.ticketId);
        console.log(`TICKET DATA:`, ticketData);
        res.json(ticketData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
}
    
    // const cid = req.cookies['cart'];
    // const user = req.session.user;
    // // const purchaser = req.user.email;
    // console.log(`cid ${cid}`);
    // console.log(`user ${user}`);
    // // console.log(`cart ${cart}`);
    // const ticketData = await ticketService.createTicket(cid,user);
    // // console.log(`TICKET DATA: ${ticketData}`);
    // // console.log(`purchaser ${purchaser}`);
    // // const ticketeData = await ticketService.findTicketByPurchaser(purchaser);
    // // console.log(ticketData);
    // res.render('ticket', {ticket: ticketData });
    // // res.render('ticket', {});

// const ticketControllerPost = async (req, res) => {
//     const cart = req.cookies['cart'];
//     const cid = cart._id;
//     const user = req.session.user;
//     // console.log(user);
//     // console.log(`cid ${cid}`);
//     // console.log(`user ${user}`);
//     const ticketData = await ticketService.createTicket(cid,user);
//     // console.log(`TICKET DATA: ${ticketData}`);
//     // console.log(`new session user ${req.session.user.ticketId}`);  
//     res.redirect("/ticket/vistas");
// }
const verCarritoController = async (req, res) => {
    const user = req.session.user;
    const cart = req.cookies['cart'];
    const cartUser = await cartService.getCartbyID(cart);
    const cartProds = cartUser.products.map(product => ({
        productId: product.productId,
        quantity: product.quantity
    }));
    console.log(cartProds);
    res.render('cartView', { user, product: cartProds });
}


export { ticketController, verCarritoController}