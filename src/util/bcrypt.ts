import bcrypt from "bcrypt";
import CustomError from "./error";

export const hassPassword = async (password: string) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (err: any) {
    throw new CustomError(
      "something happend: unable to hash password",
      err.statusCode
    );
  }
};
