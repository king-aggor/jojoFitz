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
        "Prisma error: Something went wrong. unable to update category",
        500
      );
    }
    throw new CustomError(err.message, err.statusCode);
  }
};
