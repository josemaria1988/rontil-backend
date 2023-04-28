import dotenv from "dotenv";
dotenv.config();

const config = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  sessionSecret: process.env.SESSION_SECRET,

  githubClient: process.env.GITHUB_CLIENT_ID,
  githubAPP: process.env.GITHUB_APP_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallBack: process.env.GITHUB_CALLBACK_URL
};

export default config;