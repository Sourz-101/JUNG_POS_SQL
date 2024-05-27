import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import homeRouter from "./routes/home.routes.js";
import userRouter from "./routes/user.routes.js";
import prodcutsRouter from './routes/products.routes.js'
import path from 'path';
import bodyParser from "body-parser";

const app = express();
const __dirname= path.resolve();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes declaration
app.use("/api", homeRouter);
app.use("/api/jung/v1/user", userRouter);
app.use("/api/jung/v1/products", prodcutsRouter);


app.use(express.static(path.join(__dirname, "/client/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})
export { app };
