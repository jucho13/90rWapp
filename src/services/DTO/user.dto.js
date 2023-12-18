export default class UserDTO {
    static getUserTokenFrom = (user) =>{
        return {
            name: `${user.first_name} ${user.last_name}`,
            userStatus: user.userStatus,
            cart: user.cart,
            email:user.email
        }
    }
}