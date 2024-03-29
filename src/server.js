import express from "express";
import handlebars from "express-handlebars";
import exphbs from 'express-handlebars';
import __dirname from "./utils.js";
import { Server } from "socket.io";
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';

import ProductsManager from "./daos/mongodb/ProductManager.class.js";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViews from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassportJWT } from "./config/jwt.passport.js";
import { initializePassportLocal } from "./config/local.passport.js";

const managerProducts = new ProductsManager()
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser())
initializePassportJWT()
initializePassportLocal()
app.use(passport.initialize())

const httpServer = app.listen(8080, () => {console.log('Servidor levantado')})

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');


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


//Nuevos
const connection = mongoose.connect(
    'mongodb+srv://edw2503:edw2503@cluster0.qmok5ox.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true }
)

initializePassport()

app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://edw2503:edw2503@cluster0.qmok5ox.mongodb.net/?retryWrites=true&w=majority',
    }),
    secret: 'mongoSecret',
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())

app.use("/", routerViews);
app.use('/products/', routerProducts);
app.use('/carts/', routerCart);

app.use('/api/session', sessionRouter)