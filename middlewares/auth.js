import jwt from "jsonwebtoken";
import { findUserById } from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader !== "string") {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer" || !token) {
    return next(HttpError(401, "Not authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return next(HttpError(401, "Not authorized"));
    }

    try {
      const user = await findUserById(decode.id);

      if (user === null) {
        return next(HttpError(401, "Not authorized"));
      }

      if (user.token !== token) {
        return next(HttpError(401, "Not authorized"));
      }

      req.user = { id: decode.id };

      next();
    } catch (error) {
      next(error);
    }
  });
};

export default auth;
