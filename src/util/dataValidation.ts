import CustomError from "./error";

// validate create admin data
export const createAdmin = async (adminData: {
  email: string;
  password: string;
}) => {
  const { email, password } = adminData;
  const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
  try {
    //check if email and password exit in request body
    if (!email && !password) {
      throw new CustomError(
        "email and password do not exit in request body",
        404
      );
    }
    //check if email is valid
    if (!email.match(emailFormat)) {
      throw new CustomError("Invalid email address", 422);
    }
    // check if has minimum 8 characters
    if (password.length < 8) {
      throw new CustomError("Password must have minimum of 8 characters", 422);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

// validate create customer data
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
  const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
  try {
    //check if all customer data exist
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !password ||
      !phoneNumber
    ) {
      throw new CustomError(
        "email, firstName, lastName, address, password, phoneNumber must exist in request body",
        422
      );
    }
    //check if all customer are of type string
    if (
      typeof email !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof address !== "string" ||
      typeof password !== "string" ||
      typeof phoneNumber !== "string"
    ) {
      throw new CustomError(
        "email, firstName, lastName, address, password, phoneNumber must be of type string",
        422
      );
    }
    //check if email is a valid email address
    if (!email.match(emailFormat)) {
      throw new CustomError("Invalid email format", 422);
    }
    //check password length (password must be at least 8 characters long)
    if (password.length < 8) {
      throw new CustomError("password must be atleast 8 characters long", 422);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
