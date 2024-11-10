import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authenticationRoute from "./routes/authentication";
import adminRoute from "./routes/admin";
import customerRoute from "./routes/customer";

//for env file
dotenv.config();

//middleware to use express
const app = express();

//middleware to use cors
const corsOptions = { origin: "htttp://localhost:8080" };
app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.json());

// middleware to use routes
app.use("/auth", authenticationRoute);
app.use("/admin", adminRoute);
app.use("/", customerRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to JojoFitz" });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ error: err });
});

export default app;
