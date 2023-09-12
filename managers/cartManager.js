// import fs from "fs";
// const pathToCart=("../files/cart.json");

// export class Container{
//   create = async() =>{
//       if(fs.existsSync(pathToCart)){
//           let data = await fs.promises.readFile(pathToCart,'utf-8')
//           let items = JSON.parse(data)
//           if(items.length===0){
//               let newCart = Object.assign({id:1, timestamp:Date.now(), products:[]})
//               await fs.promises.writeFile(pathToCart, JSON.stringify([newCart], null, 2)) 
//               return{status:"success", message:"New Cart Created", id:1}
//           }else{
//               let newId = items[items.length-1].id+1
//               let newCart = {}
//               newCart.id = newId
//               newCart.timestamp=Date.now()
//               newCart.products=[]
//               items.push(newCart)
//               await fs.promises.writeFile(pathToCart, JSON.stringify(items,null,2))
//               return{status:"success", message:"New Cart Created", id:newId} 
//           }
//       }else{
//           let newCart = Object.assign({id:1, timestamp:Date.now(), products:[]})
//           await fs.promises.writeFile(pathToCart, JSON.stringify([newCart], null, 2)) 
//           return{status:"success", message:"New Cart Created", id:1}
//       }
//   }
//   deleteById = async (id) =>{
//       if(!id){
//           return{status:"error", error:"Id needed"}
//       }
//       if(fs.existsSync(pathToCart)){
//           let data = await fs.promises.readFile(pathToCart,'utf-8')
//           let items = JSON.parse(data)
//           let newCart = items.filter(u => u.id !== id)
//           await fs.promises.writeFile(pathToCart,JSON.stringify(newCart,null,2))
//           return{status:"success",message:"Cart Deleted"}
//       }
//   }
//   getById = async(id)=>{
//       if(fs.existsSync(pathToCart)){
//           let data = await fs.promises.readFile(pathToCart,'utf-8');
//           let items = JSON.parse(data);
//           let cart = items.find(u => u.id === id);
//           if(cart){
//                 console.log('Cart found:', cart);
//                 return(cart);
//           }
//           else{
//                 return{status:"error", error:"Cart not found"};
//           }
//       }
//   }
//   addProduct = async (id, newProducts)=>{
//       if(!id || !newProducts){
//           return{status:"error", error:"data missing"};
//       }
//       else{
//           let data = await fs.promises.readFile(pathToCart,'utf-8');
//           let items = JSON.parse(data);
//           let cart = items.find(u => u.id === id);
//           if(cart){
//               if(cart.products.length == 0){
//                   let timestamp = cart.timestamp;
//                   let cartsNotId = items.filter(u => u.id !== id);
//                   let newCart = Object.assign({id:id, timestamp:timestamp, products:newProducts});
//                   cartsNotId.push(newCart);
//                   await fs.promises.writeFile(pathToCart, JSON.stringify(cartsNotId,null,2));
//                   return{status:"success", message:"Products Added"};
//               }else{
//                   let timestamp = cart.timestamp;
//                   let products = cart.products;
//                   let cartsNotId = items.filter(u => u.id !== id);
//                   let newerProducts = products.concat(newProducts);
//                   let newCart = Object.assign({id:id, timestamp:timestamp, products:newerProducts});
//                   cartsNotId.push(newCart);
//                   await fs.promises.writeFile(pathToCart, JSON.stringify(cartsNotId,null,2));
//                   return{status:"success", message:"Products Added"};
//               }
//           }
//           else{
//               return{status:"error", error:"Cart not found"};
//           }
//       }
      
//   }


//   deleteProduct = async (id, id_prod)=>{
//       let data = await fs.promises.readFile(pathToCart,'utf-8');
//       let items = JSON.parse(data);
//       let cart = items.find(u => u.id === id);
//       if(cart){
//           if(cart.products.length == 0){
//               return{status:"error", message:"there are no products on the cart"}
//           }else{
//               let timestamp = cart.timestamp;
//               let products = cart.products;
//               let cartsNotId = items.filter(u => u.id !== id);
//               let newProducts = products.filter(u => u !== id_prod);
//               let newCart = Object.assign({id:id, timestamp:timestamp, products:newProducts});
//               cartsNotId.push(newCart);
//               await fs.promises.writeFile(pathToCart, JSON.stringify(cartsNotId,null,2));
//               return {status:"success", message:"Product deleted"};
//           }
//       }
//       else{
//           return{status:"error", error:"Cart not found"}
//       }

//   }

// }

import { cartModel } from "../models/cartModel.js";

export default class cartService {
  constructor() { 
      console.log("Working carts with Database persistence in mongodb");
  }

  getAll = async () => {
      let carts = await cartModel.find();
      return carts.map(course=>course.toObject());
  }
  save = async () => {
      let result = await cartModel.create();
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

