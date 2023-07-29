import { Router } from "express";
import { createHash, validatePassword } from "../utils.js";
import userModel from "../daos/mongodb/models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router()

router.post(
    '/register',
    passport.authenticate('register', { session: false }),
    async (req,res)=>{
        res.send({status: 'success', message: 'usuario registrado'});
    }
);

router.post('/login', passport.authenticate("login", { session: false }), async (req,res) => {
    let token = jwt.sign({email: req.body.email, age: '900'}, 'codeSecret', {expiresIn: '24h'});
    res.cookie('coderCookie', token, {httpOnly: true}).send({status: 'success'})
});

router.get('/current', passport.authenticate("jwt", { session: false }), (req,res) => {
    res.send(req.user);
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