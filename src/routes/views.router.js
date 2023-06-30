import { Router } from "express";
import ProductsManager from "../daos/mongodb/ProductManager.class.js";
import ManagerCarts from "../daos/mongodb/CartManager.class.js";

const router = Router()

const managerProducts = new ProductsManager()
const managerCarts = new ManagerCarts();


router.get('/lista',async (req, res)=>{
    const products = await managerProducts.consultarProductos()
    res.render('home', {products})    
})

router.get('/realtimeproducts',async (req, res)=>{
    const products = await managerProducts.consultarProductos()
    console.log(products);
    res.render('realTimeProducts', {products})    
})

/* router.get('/products',async (req, res)=>{
    const products = await managerProducts.consultarProductos()
    const productPlanos = products.toObject()
    console.log(productPlanos);
    res.render('home', {products})
}) */

router.get('/products', async (req, res) => {
    const { docs } = await managerProducts.consultarProductos();
    const products = docs.map((doc) => doc.toObject());
    res.render('home', { products });
});


router.get('/carrito/:cid',async (req, res)=>{
    const cid = req.params.cid;
    const cart = await managerCarts.consultarCartPorID(cid);
    console.log(cart);
    console.log('ese fue el carrito');
    const cartPlano = cart.toObject()
    const products = cartPlano.products
    res.render('carrito', {products})
})

export default router;