import CustomError from "./error";
import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_KEY;
export const generateToken = async (payload: { id: string; role: string }) => {
  try {
    //check if jwt key is defined
    if (!jwtKey) {
      throw new CustomError("Something went wrong: JWT_KEY not defined", 550);
    }
    let token = jwt.sign(payload, jwtKey, { algorithm: "HS256" });
    token = `Bearer ${token}`;
    return token;
  } catch (err: any) {
    throw new CustomError("Something went wrong: Token not generated", 500);
  }
};
