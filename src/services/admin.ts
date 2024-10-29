import prisma from "../util/prisma";
import CustomError from "../util/error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

//add category
export const addCategory = async (categoryData: { name: string }) => {
  const { name } = categoryData;
  try {
    const category = prisma.category.create({
      data: {
        name,
      },
    });
    return category;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//update category
export const updateCategory = async (updatedCategoryData: {
  id: string;
  name: string;
}) => {
  const { id, name } = updatedCategoryData;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
    return updatedCategory;
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code == "P2025") {
        throw new CustomError(
          "Category to update does not exist in database",
          404
        );
      }
      throw new CustomError(
        ` Prisma error ${err.code}: ${err.meta?.cause}`,
        500
      );
    }
    throw new CustomError(err.message, err.statusCode);
  }
};

// delete category
export const deleteCategory = async (id: string) => {
  try {
    const deletedCategory = await prisma.category.delete({ where: { id } });
    return deletedCategory;
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code == "P2025") {
        throw new CustomError(
          "prisma error: Category to delete does not exist in database",
          404
        );
      }
      throw new CustomError(` Prisma error: ${err.code}`, 500);
    }
    // console.log(err);
    throw new CustomError(err.message, err.statusCode);
  }
};

// add product
export const addProduct = async (productdata: {
  name: string;
  quantity: number;
  description: string;
  categoryId: string;
}) => {
  const { name, quantity, description, categoryId } = productdata;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        quantity,
        description,
        categoryId,
      },
    });
    return newProduct;
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        throw new CustomError(`Prisma error: Invalid category id`, 500);
      }
      throw new CustomError(`prisma error: ${err.code}`, 500);
    }
    throw new CustomError(err.message, err.statusCode);
  }
};
