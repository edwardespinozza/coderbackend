import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";


export default class ProductsManager {

    connection = mongoose.connect('mongodb+srv://edw2503:edw2503@cluster0.qmok5ox.mongodb.net/?retryWrites=true&w=majority')
    
    crearProductos = async(info) => {
        try {
            let result = await productsModel.create(info)
            return result
        } catch(e) {
            console.log(e)
            return e
        }
        
    };

    consultarProductos = async(limit) => {
        let result = await productsModel.find().lean();
        return result
    };

    consultarProductoPorId = async(id) => {
        let result = await productsModel.findOne({_id: id})
        return result
    }

    actualizarProducto = async (id, camposActualizados) => {
        let result = await productsModel.updateOne({_id: id}, {$set: camposActualizados})
        return result
    };

    borrarProductos = async (id) => {
        let result = await productsModel.deleteOne({_id: id})
        return result
    };

}