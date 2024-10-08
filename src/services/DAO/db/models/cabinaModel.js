import mongoose from 'mongoose';

const collection = 'cabina';

const schema = new mongoose.Schema({
    cabina: Number,
    hora: Number,
    dia: Number,
    estado: Number
})

const cabinaModel = mongoose.model(collection, schema);

export default cabinaModel;