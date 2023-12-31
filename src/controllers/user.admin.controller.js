import { userService } from "../services/factory.js";
import UserDTO from "../services/DTO/user.dto.js";

export const vistaUnicaAdminUsers = async (req,res)=>{
    const users = await userService.getAll();
    let usersDTO=[];
    users.forEach(user => {
        const userdto= UserDTO.getUserTokenFrom(user);
        usersDTO.push(userdto);
    });
    res.render('vistaAdminUsers', {user: usersDTO});
}

export const deleteUser = async (req,res) =>{
    const {email}= req.body;
    const result = userService.deleteByEmail(email);
    if(result){
        res.send({message: 'success', payload: result});
    }
}

export const updateUser = async (req,res) => {
    let {email, status} = req.body;
    console.log(email);
    console.log(status);
    if (status === 'user'){
        status= 'premium';
        const result = userService.updateRole(email, status);
        res.send({message:'success', payload:result});
    }
    else{
        status= 'user';
        const result = userService.updateRole(email, status);
        res.send({message:'success', payload:result});
    }
}

export const privateMood = (req, res) => {
    res.render('private');
};