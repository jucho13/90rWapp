import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,//Se deja plano por el momento.
    cart:{
        type: Array,
        default:[]
    },
    loggedBy: String,
    status: String,
    cell: Number,
    lastConnection: Date
})

const userModel = mongoose.model(collection, schema);

export default userModel;