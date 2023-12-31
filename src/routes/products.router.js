import {Router} from "express";
import { getProducts, getProductss, createProduct, getProductByID, updateProduct, deleteProductByID} from "../controllers/product.controller.js";

const router = Router();

router.get('/api/products', getProducts);
// GET NORMAL PARA PRUEBAS
router.get('/api/productss', getProductss);
router.post('/api/productspost', createProduct);
router.get('/api/products/:pid', getProductByID);
router.put('/api/productsput/:pid', updateProduct);
router.delete('/api/productsdelete/:pid', deleteProductByID);

export default router;