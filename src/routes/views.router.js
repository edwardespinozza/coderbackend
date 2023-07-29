import { Router } from "express";
import ProductsManager from "../daos/mongodb/ProductManager.class.js";
import ManagerCarts from "../daos/mongodb/CartManager.class.js";
import passport from "passport";

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

router.get('/products', passport.authenticate('jwt', {session:false}), async (req, res) => {
    const { docs } = await managerProducts.consultarProductos();
    const products = docs.map((doc) => doc.toObject());
    res.render('home', { products, user: req.user});
});


router.get('/carrito/:cid',async (req, res)=>{
    const cid = req.params.cid;
    const cart = await managerCarts.consultarCartPorID(cid);
    const cartPlano = cart.toObject()
    const products = cartPlano.products
    res.render('carrito', {products})
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    res.render('profile', {
        user: req.user
    });
})

router.get('/resetPassword', (req,res) => {
    res.render('resetPassword')
})

export default router;