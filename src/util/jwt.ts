import CustomError from "./error";
import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_KEY;
export const generateToken = async (payload: { id: string; user: string }) => {
  try {
    //check if jwt key is defined
    if (!jwtKey) {
      throw new CustomError("Something went wrong: JWT_KEY not defined", 550);
    }
    let token = jwt.sign(payload, jwtKey, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    token = `Bearer ${token}`;
    return token;
  } catch (err: any) {
    throw new CustomError("Something went wrong: Token not generated", 500);
  }
};

export const verifyToken = async (authToken: string) => {
  //remove prefixed 'Bearer'
  const token = authToken.split(" ")[1];
  try {
    //check if jwt key is defined
    if (!jwtKey) {
      throw new CustomError("Something went wrong: JWT_KEY not defined", 500);
    }
    const decodedToken = jwt.verify(token, jwtKey);
    // Check if the decoded token is of type JwtPayload and has expected properties {id,user}
    if (
      typeof decodedToken === "object" &&
      "id" in decodedToken &&
      "user" in decodedToken
    ) {
      const { id, user } = decodedToken as { id: string; user: string };
      const tokenData: { id: string; user: string } = { id, user };
      return tokenData;
    } else {
      throw new Error("Invalid token: missing required properties.");
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
