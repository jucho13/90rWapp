import userService from "../services/DAO/db/user.service.js";
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
    
}

export const updateUser = async (req,res) => {

}

export const privateMood = (req, res) => {
    res.render('private');
};