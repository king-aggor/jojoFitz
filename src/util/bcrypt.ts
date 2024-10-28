import bcrypt from "bcrypt";
import CustomError from "./error";

//hash password
export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (err: any) {
    throw new CustomError("something happend: unable to hash password", 500);
  }
};

//verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const isPasswordMatch = await bcrypt.compareSync(password, hashedPassword);
    return isPasswordMatch;
  } catch (err: any) {
    throw new CustomError(
      "Something happened: unable to verify passsword",
      500
    );
  }
};
