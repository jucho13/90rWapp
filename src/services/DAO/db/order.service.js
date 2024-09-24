import pedidoModel from "./models/pedidoModel.js";

export default class orderService {
    saveOrder= async (cel, productos, idWP, importe, direccion)=>{
        try {
            const data = {cel:cel, productos: productos, idWP:idWP, importe:importe, direccion:direccion}
            let result = await pedidoModel.create(data);
            return result;
        } catch (error) {
            return error;
        }
    }
    getOrders= async ()=>{
        try {
            const result = await pedidoModel.find();
            return result;    
        } catch (error) {
            return error;
        }
        
    }
    getOrderByID= async (id)=>{
        try {
            const result = await pedidoModel.findOne({idWP: id});
            return result;    
        } catch (error) {
            return error;
        }
    }
}