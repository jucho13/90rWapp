export default class userCartDto {
    constructor(user) {
        this.name = user.first_name;
        this.lastName = user.last_name;
        this.age = user.age;
        this.email = user.email;
    }

}