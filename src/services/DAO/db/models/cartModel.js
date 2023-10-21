import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collectionName = 'carts';

const productSchema = new mongoose.Schema({
    productId: {
        type: String, 
        required: true
    },
    quantity: {type:Number}
});

const cartSchema = new mongoose.Schema({
    products: [productSchema]
});

cartSchema.plugin(mongoosePaginate);

export const cartModel = mongoose.model(collectionName, cartSchema);
