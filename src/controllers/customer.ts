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

// NB: cart is created on creation of new customer
// update cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  const productData: {
    productId: string;
    quantity: number;
  } = req.body;
  try {
    await dataValidation.token(authToken);
    const customerData: {
      id: string;
      user: string;
    } = await authorization.customer(authToken);
    const customerId: string = customerData.id;
    // const customerId: string = "344r3uuoijn";
    await dataValidation.addToCart(customerId, productData);
    const updatedCart = await customerService.addToCart(
      customerId,
      productData
    );
    res.status(200).json({
      message: "Cart item to customer cart added successfully",
      updatedCart,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//get customer cart items
export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  try {
    await dataValidation.token(authToken);
    const customerData: {
      id: string;
      user: string;
    } = await authorization.customer(authToken);
    const customerId: string = customerData.id;
    const cartItems = await customerService.getCartItems(customerId);
    res.status(200).json({
      message: "Fetched customer cart items successfully",
      cartItems,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//delete cart item
export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  const productId: string = req.body.productId;
  try {
    await dataValidation.token(authToken);
    const customerData: {
      id: string;
      user: string;
    } = await authorization.customer(authToken);
    await dataValidation.id(productId);
    const customerId = customerData.id;
    await customerService.removeCartItem(customerId, productId);
    res.status(200).json({
      message: `Cart item with id ${productId} removed from cart successfully`,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

// place order
export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  const address: string = req.body.address;
  try {
    await dataValidation.token(authToken);
    const customerData: {
      id: string;
      user: string;
    } = await authorization.customer(authToken);
    const customerId = customerData.id;
    // const customerId = "hr3riy633yeh";
    await dataValidation.placeOrder(address);
    const order = await customerService.placeOrder(customerId, address);
    res.status(200).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
