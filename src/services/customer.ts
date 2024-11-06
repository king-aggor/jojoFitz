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

//update cart
export const addToCart = async (
  customerId: string,
  productData: { id: string; quantity: number }
) => {
  type CartProduct = {
    id: string;
    name: string;
    quantity: number;
    price: number;
  };
  let updatedCartProducts;
  try {
    //find product to add to cart
    const product = await prisma.product.findUnique({
      where: {
        id: productData.id,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    //if product doesn't exist
    if (!product) {
      throw new CustomError(
        "Prisma error: product id is not associated with any product in product table",
        404
      );
    }
    const newProduct: CartProduct = {
      id: product.id,
      name: product.name,
      quantity: productData.quantity,
      price: product.price,
    };
    // find customer cart
    const cart = await prisma.cart.findUnique({
      where: { customerId },
    });

    //if cart not found
    if (!cart) {
      throw new CustomError("Prisma error: unable to find customer cart", 404);
    }
    //get  existing cart products array
    const existingCartProducts = cart.products as CartProduct[];

    const existingProductIndex = existingCartProducts.findIndex(
      (p) => p.id === newProduct.id
    );
    // if newProduct exists in cart products, update cart product quantity
    if (existingProductIndex >= 0) {
      updatedCartProducts = existingCartProducts.map((product, index) =>
        index === existingProductIndex
          ? { ...product, quantity: newProduct.quantity }
          : product
      );
    } else {
      //if newproduct doesnt exist in cart products, add to cart products
      updatedCartProducts = [...existingCartProducts, newProduct];
    }
    //update cart with modified cart product array
    const updatedCart = await prisma.cart.update({
      where: { customerId },
      data: {
        products: updatedCartProducts,
      },
    });

    return updatedCart;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
