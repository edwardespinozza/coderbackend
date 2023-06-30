import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'products2'

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: Number,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
})

ProductsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(collection, ProductsSchema)