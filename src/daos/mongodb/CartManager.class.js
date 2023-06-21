import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductsManager from "./ProductManager.class.js";

export default class ManagerCarts {

    connection = mongoose.connect('mongodb+srv://edw2503:edw2503@cluster0.qmok5ox.mongodb.net/?retryWrites=true&w=majority')
    
    productManager = new ProductsManager

    crearCart = async () => {
        const result = await cartModel.create({products: []});
        return result
    };

    consultarCartPorID = async (id) => {
        const result = await cartModel.findOne({_id: id}).populate('products.product');
        return result
    };

    consultarCarts = async () => {
        const result = await cartModel.find();
        return result
    };


    agregarProductoEnCarrito = async (idCart, idProduct) => {
        const product = await this.productManager.consultarProductoPorId(idProduct);
        const cart = await this.consultarCartPorID(idCart);
        cart.products.push({product: product});
        await cart.save();
        return;
    }
}