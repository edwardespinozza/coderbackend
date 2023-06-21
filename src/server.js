import express from "express";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViews from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductsManager from "./daos/mongodb/ProductManager.class.js";

const managerProducts = new ProductsManager()
const app = express();

app.use(express.json());

const httpServer = app.listen(8080, () => {console.log('servidor levantado')})

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

socketServer.on('connection', (socket) => {
    console.log("Nuevo cliente conectado!!");

    socket.on('crearProducto', async (data) => {
        console.log(data);
        await managerProducts.crearProductos(data);
        const productosActualizados = await managerProducts.consultarProductos()
        socketServer.sockets.emit('actualizarProductos', productosActualizados)
        console.log(productosActualizados)
    })

    socket.on('eliminarProducto', async (data) => {
        console.log(data);
        await managerProducts.borrarProductos(data);
        const productosActualizados = await managerProducts.consultarProductos()
        socketServer.sockets.emit('actualizarProductos', productosActualizados)
        console.log(productosActualizados)
    })
})

app.use((req, res, next) => {
    req.socketServer = socketServer;
    next()
})

app.use("/", routerViews);
app.use('/products/', routerProducts);
app.use('/carts/', routerCart);