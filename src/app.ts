import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

//for env file
dotenv.config();

//middleware to use express
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to JojoFitz" });
});

export default app;
