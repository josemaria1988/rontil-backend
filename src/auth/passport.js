import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    //Definir los middlewares que va a usar passport

    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email"}, async (req, username, password, done) => {
        try {
            const {first_name, last_name, email, age} = req.body;
            let user = await userModel.findOne({email: username});

            if(user) {
                return done(null, false);
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                passport: createHash(password)
            }

            const result = await userModel.create(newUser);

            return done(null, result);

        } catch (error) {
            return done("Error al intentar encontrar usuario" + error);
        }
    }));
    passport.use("login", new LocalStrategy({usernameField: "email"}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username});
            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            delete user.password;

            return done(null, user);
        } catch (error) {
            return done(error)
        }
}));

    passport.serializeUser( (user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser( async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
};

export default initializePassport;