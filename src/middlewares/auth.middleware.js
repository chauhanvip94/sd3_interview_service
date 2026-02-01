import database from "../config/database.js";
import { UnauthorizedError, BadRequestError } from "../utils/error.util.js";

export const validateUser = async (request, response, next) => {
  const userEmail = request.headers["x-user-email"];

  if (!userEmail) {
    throw new BadRequestError("x-user-email header is required");
  }

  const userRepository = database.getRepository("User");
  const user = await userRepository.findOneBy({ email: userEmail });

  if (!user) {
    throw new UnauthorizedError("Invalid user");
  }

  request.user = user;
  next();
};
