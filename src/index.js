import express from 'express';
import connectDB from './db/index.js';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
const app = express();

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;


// basic middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import routers
import userRouter from "./routes/user.route.js"
import todosRouter from "./routes/todos.route.js"

// use routers
app.use("/api/v1/users", userRouter)
app.use("/api/v1/todos", todosRouter)

app.get("/", (req, res) => {
  res.send("heyyyyy")
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error :", err);
  });

