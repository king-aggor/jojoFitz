import { Request, Response, NextFunction } from "express";
import CustomError from "../util/error";
import * as dataValidation from "../util/dataValidation";
import * as authenticationService from "../services/authentication";
import * as jwt from "../util/jwt";

// create account
export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  interface AdminData {
    email: string;
    password: string;
  }
  interface CustomerData {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    password: string;
    phoneNumber: string;
  }
  const user: string = req.query.user as string;
  let userData: {} = {};
  try {
    //check if user exist
    if (!user) {
      throw new CustomError(
        "User not assigned: user assigned in a query parameter as either 'admin' or 'custome'",
        422
      );
    }
    //if user is neither admin or customer send error message
    if (
      user.toLowerCase() !== "admin" &&
      user.toLocaleLowerCase() !== "customer"
    ) {
      throw new CustomError(
        "Invalid user: user must either 'admin' or 'customer'",
        422
      );
    }
    // if user == admin
    if (user.toLocaleLowerCase() == "admin") {
      const adminData = req.body as AdminData;
      await dataValidation.createAdmin(adminData);
      const admin = await authenticationService.createAdmin(adminData);
      const token = await jwt.generateToken({ id: admin.id, user: user });
      userData = { id: admin.id, email: admin.email, user, token };
    }

    // if user == customer
    if (user.toLocaleLowerCase() == "customer") {
      const customerData = req.body as CustomerData;
      await dataValidation.createCustomer(customerData);
      const customer = await authenticationService.createCustomer(customerData);
      const token = await jwt.generateToken({ id: customer.id, user: user });
      userData = {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        email: customer.email,
        user,
        token,
      };
    }
    res.status(200).json({ message: `${user} account created`, userData });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};

//user login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: string = req.query.user as string;
  const loginData: { email: string; password: string; user: string } = {
    email: req.body.email,
    password: req.body.password,
    user,
  };
  let userData: {} = {};
  try {
    await dataValidation.login(loginData);
    //if user == admin
    if (user.toLocaleLowerCase() === "admin") {
      const admin: any = await authenticationService.login(loginData);
      const token = await jwt.generateToken({ id: admin.id, user });
      userData = {
        id: admin.id,
        email: admin.email,
        user,
        token,
      };
    }

    // if user == customer
    if (user.toLocaleLowerCase() === "customer") {
      const customer: any = await authenticationService.login(loginData);
      const token = await jwt.generateToken({ id: customer.id, user });
      userData = {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        user,
        token,
      };
    }
    res
      .status(200)
      .json({ message: `${user} signed-in sucessfully`, userData });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
