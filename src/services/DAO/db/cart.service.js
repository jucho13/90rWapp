import { cartModel } from "../db/models/cartModel.js";

export default class cartService {
  constructor() { 
      console.log("Working carts with Database persistence in mongodb");
  }

  getAll = async () => {
      let carts = await cartModel.find();
      return carts.map(course=>course.toObject());
  }
  save = async () => {
      let result = await cartModel.create({products: []});
      console.log(result.products);
      return result;
  }
  update = async (id, data) => {
    try {
      const conditions = { _id: id }; // Condiciones de búsqueda
      const update = { $set: { products: data } }; // Actualización
  
      const result = await cartModel.updateOne(conditions, update);
      
      return result;
    } catch (err) {
      console.error('Error al actualizar el documento:', err);
    }
  };
  getCartbyID= async (id)=>{
    let cart= await cartModel.findOne({ _id: id });
    return cart;
  }
  delete = async (id) => {
    let deletes= await cartModel.deleteOne({ _id: id });
    return deletes;
  }
  deleteProd = async (cartID, productID) => {
    const cart = await this.getCartbyID(cartID);
    console.log(cart);
    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }
  
    // Definir products como un array vacío
    const products = [];
  
    cart.products = cart.products.filter(product => product._id.toString() !== productID);
    
    cart.products.forEach(product => {
      products.push(product._id);
    });
  
    const changes = await this.update(cartID, JSON.stringify(products));
    return changes;
  }
}

