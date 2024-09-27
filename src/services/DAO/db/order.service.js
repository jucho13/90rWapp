import pedidoModel from "./models/pedidoModel.js";

export default class orderService {
    saveOrder= async (cel, productos, importe, direccion, orderID)=>{
        try {
            const data = {cel:cel, productos: productos, importe:importe, direccion:direccion, orderID:orderID, fecha: Date.now()}
            let result = await pedidoModel.create(data);
            return result;
        } catch (error) {
            return error;
        }
    }
    updateHorario= async (cel, horario)=> {
        let horario = await pedidoModel.updateOne({cel:cel, horario: horario});
        if(horario){
            return horario;
        }
        else{
            return undefined;
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
    getOrdersByCel= async (cel)=>{
        try {
            const result = await pedidoModel.findOne({cel: cel});
            return result;    
        } catch (error) {
            return error;
        }
    }
}