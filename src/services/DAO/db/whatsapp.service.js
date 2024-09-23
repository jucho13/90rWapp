import userModel from "./models/userModel.js";


export default class whatsappService {
    saveUser= async (cel, connection)=>{
        const data = {cel:cel, lastConnection: connection, status: 'Active', loggedBy: 'whatsapp', steps: 0}
        let result = await userModel.create(data);
        return result;
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
    updateConnection = async (cel,connection) => {
        let updates = await userModel.updateOne({ cel: cel }, { $set: { lastConnection: connection } });
        return updates;
    }
}