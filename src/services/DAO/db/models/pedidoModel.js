import mongoose from 'mongoose';

const collection = 'pedidos';

const schema = new mongoose.Schema({
    productos:{
        type: Array,
        default:[]
    },
    horario: Number,
    direccion: String,
    cel: Number,
    importe: Number,
    orderID: Number,
    fecha: Date
})

const pedidoModel = mongoose.model(collection, schema);

export default pedidoModel;