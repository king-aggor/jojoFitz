import { Request, Response, NextFunction } from "express";
import * as dataValidation from "../util/dataValidation";
import * as authorization from "../util/authorization";
import * as customerService from "../services/customer";

//get product all products
export const allProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  try {
    await dataValidation.token(authToken);
    await authorization.customer(authToken);
    const products = await customerService.allProducts();
    res.status(200).json({
      message: "okay",
      products,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
