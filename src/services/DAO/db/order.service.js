import pedidoModel from "./models/pedidoModel.js";

export default class orderService {
    saveOrder= async (cel, productos, importe, orderID)=>{
        try {
            const data = {cel:cel, productos: productos, importe:importe, orderID:orderID, fecha: Date.now(), estado:'iniciado'}
            let result = await pedidoModel.create(data);
            return result;
        } catch (error) {
            return error;
        }
    }
    updateEstado= async (cel, estado) => {
        let response = await pedidoModel.updateOne({cel:cel},{$set:{estado: estado}});
        if(response){
            return response;
        }
        else{
            return undefined;
        }
    }
    updateDiaHorario= async (cel, horario,dia)=> {
        let hora = await pedidoModel.updateOne({cel:cel},{$set:{horario: horario, dia:dia}});
        if(hora){
            return hora;
        }
        else{
            return undefined;
        }
    }
    // getActiveOrderByID= async (cel,id) // este devuelve true si existe una orden activa del usuario
    updateDireccion = async (cel, direccion) =>{
        let updates= await pedidoModel.updateOne({cel:cel},{$set:{direccion:direccion}});
        return updates;
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