export default class UserDTO {
    static getUserTokenFrom = (user) =>{
        return {
            name: `${user.first_name} ${user.last_name}`,
            userStatus: user.status,
            cart: user.cart,
            cel:user.cell,
            email:user.email
        }
    }
}