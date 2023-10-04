import express from "express";
import { addProductToCart, createNewCart, deleteCart, getCarts, getCartbyID, deleteProductFromCart} from "../controllers/cart.controller.js";

const router = express.Router();

router.get('/api/cart', getCarts);
router.post('/api/cart', createNewCart);
router.delete('/api/cart/:id', deleteCart);
router.post('/api/cart/:id/products', addProductToCart);
router.get('/api/cart/:id/products', getCartbyID);
router.delete('/api/cart/:id/products/:id_prod', deleteProductFromCart);

export default router;