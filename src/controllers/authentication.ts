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
  const role: string = req.query.user as string;
  let user: {} = {};
  try {
    // if role == admin
    if (role.toLocaleLowerCase() == "admin") {
      const adminData = req.body as AdminData;
      await dataValidation.createAdmin(adminData);
      const admin = await authenticationService.createAdmin(adminData);
      const token = await jwt.generateToken({ id: admin.id, role: role });
      user = { id: admin.id, email: admin.email, role: role, token: token };
    }
    // if role == customer
    if (role.toLocaleLowerCase() == "customer") {
      const customerData = req.body as CustomerData;
      await dataValidation.createCustomer(customerData);
      const customer = await authenticationService.createCustomer(customerData);
      const token = await jwt.generateToken({ id: customer.id, role: role });
      user = {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        email: customer.email,
        token,
      };
    }

    //if role is neither admin or customer send error message
    if (role.toLowerCase() != "admin" && role != "customer") {
      throw new CustomError(
        "user not assigned: assign user in query parameter as either admin or customer",
        422
      );
    }
    res.status(200).json({ message: `User: ${role} account created`, user });
  } catch (err: any) {
    next({
      status: err.statusCode,
      message: err.message,
    });
  }
};
