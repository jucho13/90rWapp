import userModel  from "../db/models/userModel.js";


export default class userService {

  getAll = async () => {
      let users = await userModel.find();
      return users.map(user=>user.toObject());
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
  delete = async (id) => {
    let deletes= await userModel.deleteOne({ _id: id });
    return deletes;
  }
}
