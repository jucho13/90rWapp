import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,//Se deja plano por el momento.
    cart:{
        type: Array,
        default:[]
    },
    loggedBy: String 
})

const userModel = mongoose.model(collection, schema);

export default userModel;