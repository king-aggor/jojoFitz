import { Request, Response, NextFunction } from "express";
import * as dataValidation from "../util/dataValidation";
import * as authorization from "../util/authorization";
import * as customerService from "../services/customer";

//get all products
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
      message: "Get all products",
      products,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//get product by id
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  const productId: string = req.params.id;
  try {
    await dataValidation.token(authToken);
    await authorization.customer(authToken);
    await dataValidation.id(productId);
    const product = await customerService.getProduct(productId);
    res.status(200).json({
      message: "Get product by id",
      product,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
