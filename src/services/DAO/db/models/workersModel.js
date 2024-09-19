import mongoose from 'mongoose';

const collection = 'workers';

const schema = new mongoose.Schema({
    name: String,
    cel: Number,
    status: String
})

const workersModel = mongoose.model(collection, schema);

export default workersModel;