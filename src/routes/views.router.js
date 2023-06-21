import { Router } from "express";
import ProductsManager from "../daos/mongodb/ProductManager.class.js";

const router = Router()

const managerProducts = new ProductsManager()

router.get('/lista',async (req, res)=>{
    const products = await managerProducts.consultarProductos()
    res.render('home', {products})    
})

router.get('/realtimeproducts',async (req, res)=>{
    const products = await managerProducts.consultarProductos()
    console.log(products);
    res.render('realTimeProducts', {products})    
})

export default router;