import prisma from "../util/prisma";
import CustomError from "../util/error";

//get all products
export const allProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });
    return products;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//get product by id
export const getProduct = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return product;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
