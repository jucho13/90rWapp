import UserDTO from "../../DTO/user.dto.js";
import userModel  from "../db/models/userModel.js";


export default class userService {

  getAll = async () => {
      let users = await userModel.find();
      return users.map(user=>user.toObject());
  }
  getPremiumUsers = async (user) => {
    try {
      if (user.status === 'premium'){
        return true;
      }
      else
      {
        return false;
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
      // Puedes lanzar el error nuevamente o manejarlo según tus necesidades.
      throw error;
    }
  }
  
  getByID= async (id) => {
    let cart= await userModel.findOne({ _id: id });
    return cart;
  }
  save = async (data) => {
    let result = await userModel.create(data);
    return result;
  }
  update = async (id, data) => {
    let updates= await userModel.updateOne({_id: id },data);
    return updates;    
  }
  updateRole = async (email, status) => {
    let updates = await userModel.updateOne({ email: email }, { $set: { status: status } });
    return updates;
  }
  delete = async (id) => {
    let deletes= await userModel.deleteOne({ _id: id });
    return deletes;
  }
  deleteByEmail= async (email)=>{
    let deletes = await userModel.deleteOne({email:email});
    return deletes;
  }
}
