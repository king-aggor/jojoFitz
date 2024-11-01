import * as jwt from "./jwt";
import CustomError from "./error";

//verify admin
export const admin = async (authToken: string) => {
  try {
    const tokenData = await jwt.verifyToken(authToken);
    //check if user is admin
    const user = tokenData.user.toLocaleLowerCase();
    if (user !== "admin") {
      throw new CustomError("unauthorized user: user must be an admin", 493);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//verify customer
export const customer = async (authToken: string) => {
  try {
    const tokenData: { id: string; user: string } = await jwt.verifyToken(
      authToken
    );
    //check if user is admin
    const user = tokenData.user.toLocaleLowerCase();
    if (user !== "customer") {
      throw new CustomError("unauthorized user: user must be a customer", 493);
    }
    return tokenData;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
