import userModel from "./models/userModel.js";


export default class whatsappService {
    saveUser= async (cel, connection, orderId)=>{
        const data = {cel:cel, lastConnection: connection, status: 'Active', loggedBy: 'whatsapp', steps: 0, pedidoActivo:[orderId]}
        let result = await userModel.create(data);
        return result;
    }
    updateOrder= async (cel, orderId)=>{
        const user =await userModel.updateOne({cel:cel, pedidoActivo: [orderId]})
        if(user){
            return user;
        }
        else{
            return undefined;
        }
    }
    updateSteps = async (cel,step) => {
        let user = await userModel.updateOne({cel:cel, steps: step});
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
    updateDireccion = async (cel,direccion) => {
        let updates = await userModel.updateOne({ cel: cel }, { $set: { direccion: direccion } });
        return updates;
    }
    updateConnection = async (cel,connection) => {
        let updates = await userModel.updateOne({ cel: cel }, { $set: { lastConnection: connection } });
        return updates;
    }
}