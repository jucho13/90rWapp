import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    pedidoActivo: {
        type: Array,
        default:[]
    },
    pedidosCompletados:{
        type: Array,
        default:[]
    },
    direccion: String,
    loggedBy: String,
    status: String,
    cel: Number,
    steps: Number,
    lastConnection: Date
})

const userModel = mongoose.model(collection, schema);

export default userModel;