import { productModel } from "../db/models/productModel.js";

export default class productService {
  constructor() { 
      // console.log("Working products with Database persistence in mongodb");
  }
  isThisCodeRepeated= async (code)=>{
  const listaProd=await this.getAllL();
  // console.log(`lista prod title:${listaProd[0].title},lista prod: ${listaProd[0].price}`);
  const isCodeRepeated = listaProd.some((product) => product.code === code);
  // console.log(isCodeRepeated);
  if (!isCodeRepeated) {
    return true;
    }
  }
  getAll = async (optionsQuery, options) => {
      let products = await productModel.paginate(optionsQuery,options);
      // console.log(products.docs[0]);
      return products;
  }
  getAllL= async () =>{
    try {
      let products = await productModel.find();
      return products;
    } catch (error) {
      return error;
    }
    let products = await productModel.find();
    return products;
  }
  save = async (product) => {
    // console.log(`en el comienzo de save ${product.code}`);
    let validCode= await this.isThisCodeRepeated(product.code);
    if (validCode === true)
    {
      let result = await productModel.create(product);
      // console.log(result);
      return result;
    }
    else
    {
      return false;
    }
  }
  update = async (id,data) =>{
    let updates= await productModel.updateOne({_id: id },data);
    return updates;  
  }
  delete = async (id) => {
    let deletes = await productModel.deleteOne({ _id: id });
    return deletes;
  }
  getProductsByID = async (id) => {
    let product= await productModel.findOne({ _id: id });
    return product;
  }
}



