import mongoose from "mongoose";

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

export const productsModel = mongoose.model(collection, ProductsSchema)