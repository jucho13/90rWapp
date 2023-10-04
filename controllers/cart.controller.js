import cartService from "../managers/cartManager.js";
import productService from "../managers/productManager.js";
const CartService= new cartService();
const ProductService= new productService();
// import { Server } from "socket.io";

// const io = new Server();

export const getCarts=  async (req, res) => {
    try {
      const result = await CartService.getAll();
      // io.emit('newCart', result);
      res.send(result);
  
  }
    catch (error) {
      res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
  }
}

export const createNewCart= async (req, res) => {
    try {
      const result = await CartService.save();
      // io.emit('newCart', result);
      res.send(result);
  
    }
    catch (error) {
      res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
}

export const deleteCart= async (req, res) => {
    let param = req.params.id;
    const result = await CartService.delete(param);
    res.send(result);
}

export const addProductToCart = async (req, res) => {
    try {
      const cartId = req.params.id;
      const productIds = req.body.productIds; // debe enviarse un _id de un producto por el body con la propiedad 'productIds'
  
      if (!Array.isArray(productIds)) {
        return res.status(400).json({ error: 'La propiedad productIds debe ser un array.' });
      }
  
      const realProducts = [];
  
      console.log(`Cart ID = ${cartId}`);
      console.log(`Product IDs = ${productIds}`);
  
      // Obtener todos los productos
      const allProducts = await ProductService.getAllL();
  
      // Filtrar los productos que coinciden con los IDs enviados
      productIds.forEach(productId => {
        const matchingProduct = allProducts.find(product => product.id === productId);
        if (matchingProduct) {
          realProducts.push(matchingProduct);
        }
      });
  
      // Actualizar el carrito con los productos encontrados
      const carritoCompleto = await CartService.update(cartId, realProducts);
      
      return res.status(200).json(carritoCompleto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
    }
}

export const getCartbyID = async (req, res) => {
    let param = req.params.id;
    let cart = await CartService.getCartbyID(param);
    res.send(cart);
}

export const deleteProductFromCart =  async (req, res) => {
    try {
      let cartIdParam = req.params.id;
      let prodIdParam = req.params.id_prod; 
  
      if (!prodIdParam) {
        return res.status(400).json({ error: 'El parámetro id_prod debe estar presente.' });
      }
  
      let cart = await CartService.getCartbyID(cartIdParam);
      const realProducts = [];
  
      console.log(`Cart ID = ${cartIdParam}`);
      console.log(`Product ID = ${prodIdParam}`);
  
      // Obtener todos los productos
      const allProducts = await ProductService.getAllL();
  
      // Filtrar los productos que no coincidan con el ID a eliminar
      cart.products.forEach((product) => {
        // console.log(product._id);
        // console.log(prodIdParam);
        if (product._id != prodIdParam) {
          realProducts.push(product); // Agregar el producto al nuevo array
        }
      });
      // console.log(`REAL PRODUCTS CONTIENE ${JSON.stringify(realProducts)}`);
      // Actualizar el carrito con los productos encontrados
      const carritoCompleto = await CartService.update(cartIdParam, realProducts);
  
      return res.status(200).json(carritoCompleto);
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
      return res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
    }
}