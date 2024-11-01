import prisma from "../util/prisma";
import CustomError from "../util/error";

//get all products
export const allProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (err: any) {
    throw new CustomError(err.message, err.status);
  }
};
