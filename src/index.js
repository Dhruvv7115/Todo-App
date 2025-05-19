import express from 'express';
import connectDB from './db/index.js';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import cors from "cors"
const app = express();

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;


// basic middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import routers
import userRouter from "./routes/user.route.js"
import todosRouter from "./routes/todos.route.js"

// use routers
app.use("/api/v1/users", userRouter)
app.use("/api/v1/todos", todosRouter)

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error :", err);
  });
