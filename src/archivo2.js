import express from "express";
import ProductsManager from "./classes/PManager.js";

const app = express()
const productManager = new ProductsManager()