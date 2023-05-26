import express from "express";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products/', routerProducts)
app.use('/carts/', routerCart)


app.listen(8080, () => {console.log('servidor levantado')})