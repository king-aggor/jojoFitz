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
        400
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

//login validation
export const login = async (loginData: {
  email: string;
  password: string;
  user: string;
}) => {
  const { email, password, user } = loginData;
  const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
  try {
    //check if user exist
    if (!user) {
      throw new CustomError(
        "User not assigned: user assigned in a query parameter as either 'admin' or 'custome'",
        422
      );
    }
    //check user: user must be either admin or customer
    if (
      user.toLocaleLowerCase() !== "admin" &&
      user.toLocaleLowerCase() !== "customer"
    ) {
      throw new CustomError(
        "Invalid user: user must either 'admin' or 'customer'",
        422
      );
    }
    //check if email and password exist
    if (!email && !password) {
      throw new CustomError(
        "email and password need to be exist in request body",
        400
      );
    }
    //check if passowrd and email are of type string
    if (typeof email !== "string" || typeof password !== "string") {
      throw new CustomError("email and password must be of type string", 422);
    }
    // check if email is valid email address
    if (!email.match(emailFormat)) {
      throw new CustomError("invalid email format", 422);
    }
    //check password length (password must be at least 8 characters long)
    if (password.length < 8) {
      throw new CustomError("password must be atleast 8 characters long", 422);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

// token validation
export const token = async (token: string) => {
  try {
    //check if token exist
    if (!token) {
      throw new CustomError(
        "No token found: Assign token to authorization in request headers",
        401
      );
    }
    //check if token is of type string
    if (typeof token !== "string") {
      throw new CustomError("invalid token: token must be of type string", 400);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//category validation
export const category = async (categoryData: { name: string }) => {
  const { name } = categoryData;
  try {
    //check if name exist
    if (!name) {
      throw new CustomError("name must be exist in request body", 401);
    }
    //check if name is of type string
    if (typeof name !== "string") {
      throw new CustomError("name must be of type string", 400);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};

//updateCategory validation
export const updatedCategory = async (updateCategoryData: {
  id: string;
  name: string;
}) => {
  const { id, name } = updateCategoryData;
  try {
    //check if id and name exist
    if (!id || !name) {
      throw new CustomError("id and name must be exist in request body", 401);
    }
    //check if id and name is of type string
    if (typeof id !== "string" || typeof name !== "string") {
      throw new CustomError("id and name must be of type string", 400);
    }
  } catch (err: any) {
    throw new CustomError(err.message, err.statusCode);
  }
};
