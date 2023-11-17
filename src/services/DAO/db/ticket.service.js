import { ticketModel } from './models/ticketModel.js'
import { cartService } from '../../factory.js';
import { productService } from '../../factory.js';

export default class ticketService {
    
    cart;
    
    createTicket = async (cartId, user) => {
        // console.log(cartId);
        // console.log(user);
        this.cart = await cartService.getCartbyID(cartId);
        // console.log(this.cart);
        if (this.cart && user.name && user.email) {
                //valido si los productos comprados tienen stock
                let products = this.cart.products;
                // console.log(products);
                let total = 0;
                let productsWithNoStock = [];
                let productsWithStock = [];
                let productsPostPurchase = [];
                let productNoAvailable;
                let productAvailable;
                let productPostPurchase;
                for (let i = 0; i < products.length; i++) {
                    let product = await productService.getProductsByID(products[i].productId);
                    // console.log(`ticket product ${product}`);
                    if (product !== null){
                        if (product.stock < products[i].quantity) {
                            //De este producto NO hay Stock
                            productNoAvailable = {
                                notAvailableProduct: product._id,
                                quantity: products[i].quantity
                            }
                            //Acá los guardo para compatibilizarlo con el carrito
                            productPostPurchase = {
                                product: product._id,
                                quantity: products[i].quantity
                            }
                            productsWithNoStock.push(productNoAvailable);
                            productsPostPurchase.push(productPostPurchase);
                        } else {
                            //De este producto SI hay Stock
                            productAvailable = {
                                product: product._id,
                                quantity: products[i].quantity
                            }
                            productsWithStock.push(productAvailable);
                            total += (product.price * products[i].quantity);
                            //actualizo el stock del producto
                            product.stock = product.stock - products[i].quantity;
                            await productService.update(product._id, product);
                        }
                    }
                    
                }
            let ticket = {
                code: "PURCHASE_" + new Date().getTime() + "_" + user.name,
                amount: total,
                purchaser: user.email,
                products: productsWithStock,
                notAvailableProducts: productsWithNoStock
            };
            const insert = await ticketModel.create(ticket);
            cartService.update(cartId, productsPostPurchase);
            return '{"status":"success", "message":"Ticket created", "ticketId":"' + insert._id + '"}';
        } else {
            return '{"status":"failed", "message":"Cart not found"}';
        }
    }
    findTicketByPurchaser = async (purchaser)=>{
        try {
            const ticket = await ticketModel.findOne( {purchaser: purchaser });
            return ticket;
        } catch (error) {
            // console.log("ERROR: " + error);
        }
    }
    loadTicket = async (ticketId) => {
        try {
            const ticket = await ticketModel.findOne( {_id: ticketId });
            return ticket;
        } catch (error) {
            // console.log("ERROR: " + error);
        }
    }
}