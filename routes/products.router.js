import {Router} from "express";
import productService from "../managers/productManager.js";
import { getProducts, getProductss, createProduct, getProductByID, updateProduct, deleteProductByID } from "../controllers/product.controller.js";

const router = Router();
const manager = new productService();

router.get('/api/products', getProducts);
// GET NORMAL PARA PRUEBAS
router.get('/api/productss', getProductss);
router.post('/api/products', createProduct);
router.get('/api/products/:pid', getProductByID);
router.put('/api/products/:pid', updateProduct);
router.delete('/api/products/:pid', deleteProductByID);

export default router;