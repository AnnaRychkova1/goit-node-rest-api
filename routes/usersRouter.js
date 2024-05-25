import express from "express";

import validateBody from "../helpers/validateBody.js";
import * as schema from "../schemas/users.js";
import authMiddleware from "../middlewares/auth.js";

import {
  register,
  login,
  logout,
  current,
  updateSubscription,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schema.userCreateSchema), register);

usersRouter.post("/login", validateBody(schema.userCreateSchema), login);

usersRouter.post("/logout", authMiddleware, logout);

usersRouter.get("/current", authMiddleware, current);

usersRouter.patch(
  "/",
  authMiddleware,
  validateBody(schema.userUpdateSubscriptionSchema),
  updateSubscription
);

export default usersRouter;
