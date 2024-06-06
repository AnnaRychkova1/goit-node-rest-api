import express from "express";

import validateBody from "../helpers/validateBody.js";
import * as schema from "../schemas/users.js";
import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

import {
  register,
  verifyEmail,
  resendingVerifyEmail,
  login,
  logout,
  current,
  updateSubscription,
  changeAvatar,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schema.userCreateSchema), register);

usersRouter.get("/verify/:verificationToken", verifyEmail);

usersRouter.post(
  "/verify",
  validateBody(schema.userValidateVerifyEmail),
  resendingVerifyEmail
);

usersRouter.post("/login", validateBody(schema.userCreateSchema), login);

usersRouter.post("/logout", authMiddleware, logout);

usersRouter.get("/current", authMiddleware, current);

usersRouter.patch(
  "/",
  authMiddleware,
  validateBody(schema.userUpdateSubscriptionSchema),
  updateSubscription
);

usersRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  changeAvatar
);

export default usersRouter;
