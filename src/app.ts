import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authenticationRoute from "./routes/authentication";

//for env file
dotenv.config();

//middleware to use express
const app = express();

//middleware to use cors
const corsOptions = { origin: "htttp://localhost:8080" };
app.use(cors(corsOptions));

app.use(express.json());

// middleware to use routes
app.use("/auth", authenticationRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to JojoFitz" });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ error: err });
});

export default app;
