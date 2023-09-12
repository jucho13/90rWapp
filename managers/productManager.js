
// import fs from "fs";

// class Product {
//   constructor(title, description, price, thumbnail, code, stock, status, id) {
//     this.title = title;
//     this.description = description;
//     this.price = price;
//     this.thumbnail = [thumbnail];
//     this.code = code;
//     this.stock = stock;
//     this.status = status;
//     this.id = id;
//   }
// }

// export class ProductManager {
//   #products;
//   #productDirPath;
//   #productFilePath;
//   #lastProductIdPath;

//   constructor() {
//     this.#products = [];
//     this.#productDirPath = 'src/files';
//     this.#productFilePath = `${this.#productDirPath}/Products.json`;
//     this.#lastProductIdPath = `${this.#productDirPath}/lastProductId.json`;
//   }

//   readFile = async (filePath) => {
//     try {
//       const fileContent = await fs.promises.readFile(filePath, 'utf-8');
//       return JSON.parse(fileContent);
//     } catch (error) {
//       console.error(`Error reading file ${filePath}: ${error}`);
//       return [];
//     }
//   }

//   writeFile = async (filePath, data) => {
//     try {
//       await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2, '\t'));
//     } catch (error) {
//       console.error(`Error writing file ${filePath}: ${error}`);
//     }
//   }

//   getNextProductId = async () => {
//     try {
//       const lastProductIdContent = await this.readFile(this.#lastProductIdPath);
//       let lastProductId = 0;
//       if (lastProductIdContent && lastProductIdContent.id) {
//         lastProductId = lastProductIdContent.id;
//       }
//       const nextProductId = lastProductId + 1;
//       await this.writeFile(this.#lastProductIdPath, { id: nextProductId });
//       return nextProductId;
//     } catch (error) {
//       console.error(`Error getting next product ID: ${error}`);
//       throw new Error(`Error getting next product ID: ${error}`);
//     }
//   }

// isThisCodeRepeated= async (code)=>{
//   const listaProd=await this.productList();
//   const isCodeRepeated = listaProd.some((product) => product.code === code);
//   if (!isCodeRepeated) {
//     return true;
//   }
// }

//   createProduct = async (title, description, price, thumbnail, code, stock, status,id) => {
//     const isRepeated = await isThisCodeRepeated(code);
//     if (isRepeated !== true){
//    return { code: 400, status: 'Código de producto repetido' };
//}
//     let newProduct="";
//     if(id === 0){
//       let newProductId = await this.getNextProductId();
//       newProduct = new Product(title, description, price, thumbnail, code, stock, status, newProductId);
//     }else{
//       newProduct = new Product(title, description, price, thumbnail, code, stock, status, id);
//     }
//     console.log('Crear Producto: producto a registrar:');
//     console.log(newProduct);

//     try {
//       await fs.promises.mkdir(this.#productDirPath, { recursive: true });
//       const productsFileExists = await fs.promises.stat(this.#productFilePath).catch(() => false);

//       if (!productsFileExists) {
//         await fs.promises.writeFile(this.#productFilePath, '[]');
//       }

//       this.#products = await this.readFile(this.#productFilePath);

//       console.log('Productos encontrados:');
//       console.log(this.#products);

//       this.#products.push(newProduct);
//       console.log('Lista actualizada de productos:');
//       console.log(this.#products);

//       await this.writeFile(this.#productFilePath, this.#products);
//       return { code: 200, status: 'Producto agregado' };
//     } catch (error) {
//       console.error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
//       throw new Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
//     }
//   }



//     productList = async () => {
//         try {

//             //leemos el archivo
//             let productsFile = await fs.promises.readFile(this.#productFilePath, "utf-8");


//             //Obtenemos el JSON String 
//             console.info("Archivo JSON obtenido desde archivo: ");
//             console.log(productsFile);
//             this.#products = JSON.parse(productsFile);
//             console.log("Productos encontrados: ");
//             console.log(this.#products);
//             return this.#products;

//         } catch (error) {
//             console.error(`Error consultando los productos por archivo, valide el archivo: ${this.#productDirPath}, 
//                 detalle del error: ${error}`);
//             throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#productDirPath},
//              detalle del error: ${error}`);
//         }
//     }  
//     //Leer productos por ID

//     getProductsbyID = async (id) => {
//       let products = await this.productList();
//       console.log(products);
  
//       const produ = products.find((prod) => prod.id === id);
  
//       if (!produ) {
//           console.log(`Producto ${id} en el programa = ${produ}`);
//           console.log("Producto buscado por ID: NOT FOUND");
//       } else {
//           console.log(`Producto ${id} en el programa = ${produ}`);
//           console.log("Objeto obtenido por ID = ");
//           console.log(produ);
//           return JSON.stringify(produ);
//       }
//   }
  
  
//     deleteProduct = async (id) => {
//       try {
//         let productLista=await this.productList();
//         const index = productLista.findIndex((prod) => (prod.id) === id);
//         if (index === -1) {
//           console.log(`No se encontró ningún producto con ID: ${id}`);
//           return false;
//         }
    
//         this.#products.splice(index, 1);
    
//         await fs.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2, '\t'));
//         console.log("Producto eliminado correctamente");
//         return true;
//       } catch (error) {
//         console.error(`Error al eliminar el producto con ID ${id}: ${error}`);
//         return false;
//       }
//     };
    



//     //Actualizar un producto pidiendo su informacion

//     async updateProduct (title, description, price, thumbnail, code, stock,status,id){
//         const listaProd= this.productList(); 
//         const index = listaProd.findIndex(obj => obj.id === id);
//         console.log(`El siguiente producto va a ser updateado por:${title} description: ${description}`);
//         await this.deleteProduct(id);
//         const updateado=await this.createProduct(title,description,price,thumbnail,code,stock,status,id);
//         if (updateado){
//             return (JSON.stringify(updateado));
//         }
        
//     }
    
    
// }
  
import { productModel } from "../models/productModel.js";

export default class productService {
  constructor() { 
      console.log("Working products with Database persistence in mongodb");
  }
  isThisCodeRepeated= async (code)=>{
  const listaProd=await this.getAllL();
  console.log(`lista prod title:${listaProd[0].title},lista prod: ${listaProd[0].price}`);
  const isCodeRepeated = listaProd.some((product) => product.code === code);
  console.log(isCodeRepeated);
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
    let products = await productModel.find();
    return products;
  }
  save = async (product) => {
    console.log(`en el comienzo de save ${product.code}`);
    let validCode= await this.isThisCodeRepeated(product.code);
    if (validCode === true)
    {
      let result = await productModel.create(product);
      console.log(result);
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
  deleteProd= async (id, idProd) => {
    let deletes = await productModel.deleteOne ({_id:id, products_id:idProd});
  }
  getProductsByID = async (id) => {
    let product= await productModel.findOne({ _id: id });
    return product;
  }
}



