import mongoose from 'mongoose';

const collection = 'pedidos';

const schema = new mongoose.Schema({
    productos:{
        type: Array,
        default:[]
    },
    direccion: String,
    cel: Number,
    importe: Number,
    idWP: String
})

const pedidoModel = mongoose.model(collection, schema);

export default pedidoModel;