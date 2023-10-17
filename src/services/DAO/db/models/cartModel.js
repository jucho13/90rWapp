import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type:Array,
        default:[]
    }
});

cartSchema.plugin(mongoosePaginate);

export const cartModel = mongoose.model(collectionName, cartSchema);