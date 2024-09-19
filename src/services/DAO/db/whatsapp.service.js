import userModel from "./models/userModel.js";


export default class whatsappService {
    saveUser= async (cel, connection)=>{
        const data = {cel:cel, lastConnection: connection, status: 'Active', loggedBy: 'whatsapp'}
        let result = await userModel.create(data);
        return result;
    }
    getByNumber= async (cel) => {
        let user= await userModel.findOne({ cel: cel });
        if (user){
            return true;
        }
        else{
            false
        }
    }
    getLastConnection = async (cel) => {
        let user= await userModel.findOne({ cel: cel });
        console.log(user);
        return user.lastConnection;
    }
    updateConnection = async (cel,connection) => {
        console.log(connection);
        
        let updates = await userModel.updateOne({ cel: cel }, { $set: { lastConnection: connection } });
        return updates;
    }
}