import { Request, Response, NextFunction } from "express";
import * as dataValidation from "../util/dataValidation";
import * as authorization from "../util/authorization";
import * as customerService from "../services/customer";
import crypto from "crypto";

const paystack_secret_key: any = process.env.PAYSTACK_SECRET_KEY;

//get all products
export const allProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const authToken = req.headers.authorization as string;
  try {
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
  const productId: string = req.params.id;
  try {
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
    const customerId: string = customerData.id;
    await dataValidation.placeOrder(address);
    const paymentInitializationDetails = await customerService.placeOrder(
      customerId,
      address
    );
    res.status(200).json({
      message: "Order placed successfully",
      paymentInitializationDetails,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//get orders
export const orders = async (
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
    const orders = await customerService.orders(customerId);
    res.status(200).json({
      message: "customer orders fetched successfully",
      orders,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//get specific order
export const order = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization as string;
  const orderId: string = req.params.orderId;
  try {
    await dataValidation.token(authToken);
    const customerData: {
      id: string;
      user: string;
    } = await authorization.customer(authToken);
    await dataValidation.id(orderId);
    const customerId: string = customerData.id;
    const orderData = { customerId, orderId };
    const order = await customerService.getOrder(orderData);
    res.status(200).json({
      message: "customer order fetch successfully",
      order,
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//webhook
export const webhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const event: {} = req.body;
  try {
    const hash = await crypto
      .createHmac("sha512", paystack_secret_key)
      .update(JSON.stringify(req.body))
      .digest("hex");
    // verify event origin
    if (hash == req.headers["x-paystack-signature"]) {
      await customerService.updatePayment(event);
    }
    res.status(200).json({
      message: "okay",
    });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
