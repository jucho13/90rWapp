import userModel from "./models/userModel.js";


export default class whatsappService {
    saveUser= async (cel, connection, orderId)=>{
        const data = {cel:cel, lastConnection: connection, status: 'Active', loggedBy: 'whatsapp', steps: 0, orderId:[orderId]}
        let result = await userModel.create(data);
        return result;
    }
    updateOrder= async (cel, orderId)=>{
        const user = userModel.updateOne({cel:cel, pedidoActivo: [orderId]})
        if(user){
            return user;
        }
        else{
            return undefined;
        }
    }
    updateSteps = async (cel,step) => {
        let user = userModel.updateOne({cel:cel, steps: step});
        if(user){
            return user;
        }
        else{
            return undefined;
        }
    }
    getByNumber= async (cel) => {
        let user= await userModel.findOne({ cel: cel });
        if (user){
            return user;
        }
        else{
            undefined;
        }
    }
    getLastConnection = async (cel) => {
        let user= await userModel.findOne({ cel: cel });
        if(user){
            return user.lastConnection;
        }
        else{
            return undefined;
        }
    }
    updateDireccion = async (cel, direccion) =>{
        let updates= await userModel.updateOne({cel:cel},{$set:{direccion:direccion}});
        return updates;
    }
    getActiveOrderByID= async (cel,id) // este devuelve true si existe una orden activa del usuario
    updateConnection = async (cel,connection) => {
        let updates = await userModel.updateOne({ cel: cel }, { $set: { lastConnection: connection } });
        return updates;
    }
}