import express from "express";
import { addProductToCart,addProductToCartByApp, createNewCart, deleteCart, getCarts, getCartbyID, deleteProductFromCart} from "../controllers/cart.controller.js";

const router = express.Router();

router.get('/api/cart', getCarts);
router.post('/api/cartpost', createNewCart);
router.delete('/api/cart/:id', deleteCart);
router.post('/api/cartp/:id/products', addProductToCart);
router.put('/api/cart/productsput', addProductToCartByApp);
router.get('/api/cartget/:id/products', getCartbyID);
router.delete('/api/cart/:id/products/:id_prod', deleteProductFromCart);

export default router;