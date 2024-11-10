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
  productData: { productId: string; quantity: number }
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
        id: productData.productId,
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
      select: {
        products: true,
      },
    });

    return updatedCart;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//get customer cart items
export const getCartItems = async (customerId: string) => {
  try {
    //find cart by customer id
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      select: {
        products: true,
      },
    });
    //if customer cart not found
    if (!cart) {
      throw new CustomError("Database error: customer cart not found", 404);
    }
    //extract cart items fro cart
    const cartItems = cart?.products;
    return cartItems;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

// remove customer cart item from cart
export const removeCartItem = async (customerId: string, productId: string) => {
  try {
    //find cart by customer id
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      select: {
        products: true,
      },
    });
    //if cart customer cart does not exist
    if (!cart) {
      throw new CustomError("Database error: customer cart not found", 404);
    }
    const cartProdutcs = cart.products;
    //check if product field is an array
    if (!Array.isArray(cartProdutcs)) {
      throw new CustomError(
        "Database error: cart products must be an array",
        400
      );
    }
    //check if productId exists in cart products array
    const productExists = cartProdutcs.some(
      (product: any) => product.id === productId
    );
    if (!productExists) {
      throw new CustomError(
        `Database error: product with id ${productId} does not exist in cart items`,
        404
      );
    }
    // Filter and return cart products who's id isnt equal to product id
    const updatedcartProducts: any = cartProdutcs.filter(
      (product: any) => product.id !== productId
    );
    //update customer cart
    const updatedCart = await prisma.cart.update({
      where: { customerId },
      data: {
        products: updatedcartProducts,
      },
    });
    return updatedCart;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//place order
export const placeOrder = async (customerId: string, address: string) => {
  try {
    //find customer cart
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      select: {
        products: true,
      },
    });
    // if cart not found
    if (!cart) {
      throw new CustomError(
        "Database error: customer id is not associated with any cart in database",
        404
      );
    }
    // extract cart items from cart
    const cartItems:
      | {
          id: string;
          name: string;
          price: number;
          quantity: number;
        }[]
      | {} = cart.products;
    //check if cartItems is an array
    if (!Array.isArray(cartItems)) {
      throw new CustomError(
        "Database error: cart products must be an array",
        400
      );
    }
    //if cartItems is an empty array
    if (cartItems.length < 1) {
      throw new CustomError(
        "Database error: Customer has no items in cart",
        404
      );
    }

    // find each product in cart items array and calculate totalAmount (cart item quanty *  price)
    let productIds: { id: string }[] = [];
    let orderItems: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[] = [];
    let totalAmount: number = 0;
    let product;
    for (const item of cartItems) {
      product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      //if product exist and product quantity is more than or eqaul to cart item quantity
      if (product && product.quantity >= item.quantity) {
        productIds.push({ id: product.id });
        orderItems.push(item);
        totalAmount += item.quantity * item.price;
      }
    }
    //create order
    const order = await prisma.order.create({
      data: {
        address,
        orderItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        customerId,
        products: {
          connect: productIds,
        },
      },
    });

    //if order not created
    if (!order) {
      throw new CustomError("prisma error: could not place order", 400);
    }
    // delete cart products
    await prisma.cart.update({
      where: { customerId },
      data: {
        products: [],
      },
    });

    return order;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//  "cm2v3a1mj0001q2d8qxvo2y4k",
//             "cm2yrs52p000583pldn14ryq2"
