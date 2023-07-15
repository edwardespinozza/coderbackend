import { Router } from "express";
import { createHash, validatePassword } from "../utils.js";
import userModel from "../daos/mongodb/models/user.model.js";
import passport from "passport";

const router = Router()

router.post('/register', async (req,res)=>{
    const {first_name, last_name, email, age, password, role} = req.body
    const exist = await userModel.findOne({email});

    if (exist) return res.status(400).send({status: 'error', message: 'Usuario ya registrado'})
    let result = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role
    });
    res.send({status: 'success', message: 'usuario registrado'})
});

router.post('/login', async (req,res) => {
    const {email, password } = req.body;
    const user = await userModel.findOne({email: email})
    console.log(`el usuario es ${user}`);
    if (!user) {
        return res.status(400).send({ status: 'error', message: 'usuario o contraseña incorrecta' });
    }
    if (!validatePassword(password, user)) {
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

router.post('/restartPassword', async (req,res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email})
    if (!user) {
        return res.status(400).send({ status: 'error', message: 'usuario o contraseña incorrecta' });
    }
    const newPasswordHashed = createHash(password)
    await userModel.updateOne({_id: user._id}, {$set: {password: newPasswordHashed}})
    res.send({status: 'success'})
})

router.get('/github', passport.authenticate('github', {scope: "user:email"}),
    (req,res) => {}
)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    console.log('exito')
    req.session.user = req.user
    res.redirect('/')
})


export default router;