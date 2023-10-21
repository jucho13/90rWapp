import { cartModel } from "../db/models/cartModel.js";
import mongoose from "mongoose";

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
      return result;
  }
  saveProducts = async (idCart,data)=>{ 
    console.log(data);
    const result=await cartModel.updateOne({_id:idCart}, {products: data})
    return result;
  }
  // update = async (id, idProd) => {
  //   try {
  //   console.log(`ID CART ${id}`);
  //   console.log(`ID PROD ${idProd}`);
  //   // const productId = new mongoose.Types.ObjectId(idProd);
  //   // console.log(productId);
  //   let idProds=[]
  //   const cart = await cartModel.findOne({ _id: id });
  //   console.log(cart);
  //   if(cart.products !== null){
  //     for (let i=0;i<cart.products.length;i++){
  //       let IDS=(cart.products[i]._id);
  //       let stringValue=IDS.toString();
  //       idProds.push(stringValue);
  //     }
  //     idProds.push(idProd);
  //   }
    
    
  //   console.log(`ID PRODS ${idProds}`);
  
  //   const result = await this.saveProducts(id, idProds);
  //   return { message: "success", payload: result }; 
  // } catch (err) {
  //     console.error('Error al actualizar el documento:', err);
  //   }
  // };
  update = async (id, idProd) => {
    try {
      console.log(`ID CART ${id}`);
      console.log(`ID PROD ${idProd}`);
      
      const cart = await cartModel.findOne({ _id: id });
      
      // Busca el índice del producto en el array 'products' que coincide con idProd
      const productIndex = cart.products.findIndex(product => product.productId === idProd);
      
      if (productIndex !== -1) {
        // Si se encuentra el producto en el carrito, incrementa la cantidad
        cart.products[productIndex].quantity += 1;
      } else {
        // Si el producto no se encuentra en el carrito, agrégalo al array
        cart.products.push({ productId: idProd, quantity: 1 });
      }
      
      console.log(`products a guardar ${cart.products}`);
      
      // Ahora actualizamos el documento en la base de datos usando updateOne
      const result = await cartModel.updateOne({ _id: id }, { products: cart.products });
      
      return { message: "success", payload: result };
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

