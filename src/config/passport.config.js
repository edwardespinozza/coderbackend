import passport from "passport";
import GithubStrategy from 'passport-github2'
import userModel from "../daos/mongodb/models/user.model.js";

export const initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.916bfbb6483c57ff',
        clientSecret: '4695333bce4a61fcc512214c5598ac8c7b19552a',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        let user = await userModel.findOne({email: profile._json.email})
        if (!user) {
            let newUser = {
                first_name: profile.username,
                last_name: 'test lastname',
                email: profile.profileUrl,
                age: 25,
                password: '123',
                role: 'usuario'
            }
            const result = await userModel.create(newUser)
            done(null,result)
        } else {
            done(null, false)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
} 