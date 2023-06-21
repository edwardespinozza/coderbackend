import { Router } from "express";
import ProductsManager from "../daos/mongodb/ProductManager.class.js";

const router = Router()

const managerProducts = new ProductsManager()

router.get('/',async (req, res)=>{
    const limit = req.query.limit
    const products = await managerProducts.consultarProductos(limit)
    res.send(products)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await managerProducts.consultarProductoPorId(id);
    res.send({ product });
})

router.post('/', async (req, res) => {
    console.log(req.body);
    const product = req.body;

    if (!product.title) {
        res.send({ status: "error", message: 'Los campos "title", "description", "code", "price", "status", "stock" y "category" son obligatorios' });
    } else {
        await managerProducts.crearProductos(product);
        const products = await managerProducts.consultarProductos();
        req.socketServer.sockets.emit('actualizarProductos', products)

        res.send({ status: "success" });
    }

    /* managerProducts.crearProductos(product);
    req.socketServer.emit('products', managerProducts.consultarProductos());
    res.send({ status: "success" }); */
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const camposActualizados = req.body;
    if (Object.keys(camposActualizados).length === 0) {
        res.send({ status: "error", message: 'No se proporcionaron campos para actualizar' });
        return;
    }
    const productoActualizado = await managerProducts.actualizarProducto(id, camposActualizados);
    if (!productoActualizado) {
        res.send({ status: "error", message: 'Producto no encontrado' });
    } else {
        res.send({ status: "success", product: productoActualizado });
    }
});  

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await managerProducts.borrarProductos(id);
    if (!product) {
        res.send({ status: "error", message: 'Producto no encontrado' });
    } else {
        res.send({ status: "success", message: 'Producto eliminado', product });
    }
})

export default router;