import prisma from "../util/prisma";
import CustomError from "../util/error";
import * as bcrypt from "../util/bcrypt";
import { json } from "express";

//create admin
export const createAdmin = async (adminData: {
  email: string;
  password: string;
}) => {
  const { email, password } = adminData;
  try {
    //check if there is an existing admin account
    const numOfAdmin: number = await prisma.admin.count();
    if (numOfAdmin >= 1) {
      throw new CustomError("There is an exixsting admin account", 409);
    }
    //if there is no admin account
    const hashedPassword: string = await bcrypt.hashPassword(password);
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return admin;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//create customer
export const createCustomer = async (customerData: {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  password: string;
  phoneNumber: string;
}) => {
  const { email, firstName, lastName, address, password, phoneNumber } =
    customerData;
  try {
    //check if email is associated with any user
    const existingUser = await prisma.customer.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new CustomError(`Customer with ${email} already exist`, 409);
    }
    //if email doesn exist
    const hashedPassword = await bcrypt.hashPassword(password);
    const customer = await prisma.customer.create({
      data: {
        email,
        firstName,
        lastName,
        address,
        phoneNumber,
        password: hashedPassword,
        cart: {
          create: {},
        },
      },
      include: {
        cart: true,
      },
    });
    return customer;
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

// user login
export const login = async (userData: {
  email: string;
  password: string;
  user: string;
}) => {
  const { email, password, user } = userData;
  try {
    //if user is admin
    if (user.toLocaleLowerCase() === "admin") {
      //check if admin with user email exist
      const admin = await prisma.admin.findUnique({
        where: {
          email,
        },
      });
      if (!admin) {
        throw new CustomError("admin does not exist", 404);
      }
      // check if password match
      const isPasswordMatch = await bcrypt.verifyPassword(
        password,
        admin.password
      );
      if (!isPasswordMatch) {
        throw new CustomError("incorrect password", 401);
      }
      return admin;
    }

    //if user is customer
    if (user.toLocaleLowerCase() === "customer") {
      //check if customer with user email exist
      const customer = await prisma.customer.findUnique({
        where: {
          email,
        },
      });
      if (!customer) {
        throw new CustomError("customer does not exist", 404);
      }
      //check if password match
      const isPasswordMatch = await bcrypt.verifyPassword(
        password,
        customer.password
      );
      if (!isPasswordMatch) {
        throw new CustomError("incorrect password", 401);
      }
      return customer;
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
