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

//update category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken: string = req.headers.authorization as string;
  const updatedCategoryData: { id: string; name: string } = req.body;
  try {
    await datavalidation.token(authToken);
    await authorization.admin(authToken);
    await datavalidation.updatedCategory(updatedCategoryData);
    const updatedCategory = await adminService.updateCategory(
      updatedCategoryData
    );
    res.status(200).json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (err: any) {
    next({
      status: err.status,
      message: err.message,
    });
  }
};

//delete category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken: string = req.headers.authorization as string;
  const id: string = req.body.id;
  try {
    await datavalidation.token(authToken);
    await authorization.admin(authToken);
    await datavalidation.id(id);
    const deletedCategory = await adminService.deleteCategory(id);
    res.status(200).json({
      message: `category deleted successfully`,
      deletedCategory,
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
