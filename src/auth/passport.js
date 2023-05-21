import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userModel from "../dao/schemas/user.schema.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import config from "../config.js";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "passport-jwt";


const { 
  githubClient, 
  githubSecret, 
  githubCallBack, 
  googleClient, 
  googleSecret, 
  googleCallBack,
  jwtSecret 
} = config;

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookie"];
  }
  return token;
}

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
}

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error when trying to find user:" + error);
        }
      }
    )
  );

  passport.use("jwt", new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  })),

    //////////////////////////////// GITHUB LOGIN ////////////////////////////////
    passport.use("githublogin", new GitHubStrategy({
      clientID: githubClient,
      clientSecret: githubSecret,
      callbackURL: githubCallBack,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ email: profile._json.email });
        
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 18,
            email: profile._json.email,
            password: "",
          };

          let result = await userModel.create(newUser);
          return done(null, result);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }

    }))
  

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  ////////// GOOGLE LOGIN //////////

  passport.use( 'googlelogin', new GoogleStrategy( {
    clientID: googleClient,
    clientSecret: googleSecret,
    callbackURL: googleCallBack
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({email: profile.emails[0].value});

      if (!user) {
        let newUser = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          age: 18,
          email: profile.emails[0].value,
          password: "",
        };
        let result = await userModel.create(newUser);
        return done(null, result);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
   
  }))
};

export default initializePassport;