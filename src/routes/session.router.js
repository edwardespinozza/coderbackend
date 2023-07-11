import { Router } from "express";
import userModel from "../daos/mongodb/models/user.model.js";

const router = Router()

router.post('/register', async (req,res)=>{
    const {first_name, last_name, email, age, password, role} = req.body
    const exist = await userModel.findOne({email});

    if (exist) return res.status(400).send({status: 'error', message: 'Usuario ya registrado'})
    let result = await userModel.create({first_name, last_name, email, age, password, role});
    res.send({status: 'success', message: 'usuario registrado'})
});

router.post('/login', async (req,res) => {
    const {email, password } = req.body;
    const user = await userModel.findOne({email: email, password: password})
    console.log(`el usuario es ${user}`);
    if (!user) {
        return res.status(400).send({ status: 'error', message: 'usuario o contraseña incorrecta' });
    }
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        user.role = 'admin';
    }
    
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    res.send({status: 'success', message: req.session.user})
    
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        console.error('Error al destruir la sesión:', err);
        } else {
        res.redirect('/login');
        }
    });
});

export default router;