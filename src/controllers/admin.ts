import { Request, Response, NextFunction } from "express";
import * as datavalidation from "../util/dataValidation";
import * as authorization from "../util/authorization";
import * as adminService from "../services/admin";

//add category
export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken: string = req.headers.authorization as string;
  const categoryData: { name: string } = req.body;
  try {
    await datavalidation.token(authToken);
    await authorization.admin(authToken);
    await datavalidation.category(categoryData);
    const category = await adminService.addCategory(categoryData);
    res.status(200).json({
      message: "Category created successfully",
      categoryData: category,
    });
  } catch (err: any) {
    next({
      status: err.status,
      message: err.message,
    });
  }
};

//add product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization: string = req.headers.authorization as string;
  const productData: {
    name: string;
    quantity: number;
    description: string;
    categoryId: string;
  } = req.body;
  try {
    res.status(200).json({
      message: "ok",
      authorization,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
