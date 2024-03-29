import dotenv from "dotenv";

const environment = "DEVELOPMENT";

dotenv.config({
  path: environment === "PRODUCTION" ? "./.env.production" : "./.env.development",
});

const config = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  jwtSecret: process.env.JWT_SECRET,

  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallBack: process.env.GITHUB_CALLBACK_URL,

  googleClient: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallBack: process.env.GOOGLE_CALLBACK_URL,

  nodemailerService: process.env.NODEMAILER_SERVICE,
  nodemailerPort: process.env.NODEMAILER_PORT,
  nodemailerUser: process.env.NODEMAILER_USER,
  nodemailerPass: process.env.NODEMAILER_PASSWORD,
};

export default config;