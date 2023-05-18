import express from "express";
import UsuariosManager from "./classes/UsuariosManager.js";

const app = express()
const usuariosManager = new UsuariosManager()


app.get('/usuarios',async (req, res)=>{
    const limit = req.query.limit
    const usuarios = await usuariosManager.consultarUsuarios(limit)
    res.send(usuarios)
})

app.get('/usuarios/:id', async (req, res) => {
    const usuario = await usuariosManager.consultarUsuarioPorId(req.params.id)
    res.send(usuario)
})

app.listen(8080, ()=>{console.log('servidor levantado')})