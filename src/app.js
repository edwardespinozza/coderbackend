import express from "express";
import ProductsManager from "./classes/PManager.js";

const app = express()
const productManager = new ProductsManager()

app.get('/products',async (req, res)=>{
    const limit = req.query.limit
    const products = await productManager.consultarProductos(limit)
    res.send(products)
})

app.get('/products/:pid', async (req, res) => {
    const product = await productManager.consultarProductoPorId(req.params.pid)
    res.send(product)
})

app.listen(8080, ()=>{console.log('servidor levantado')})