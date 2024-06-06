import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

import usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const isUser = await usersService.findUserByElement({ email });

    if (isUser !== null) {
      return next(HttpError(409, "Email in use"));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { s: "200", d: "retro" });

    const verificationToken = nanoid();

    const newUser = await usersService.createUser(
      email,
      passwordHash,
      avatarURL,
      verificationToken
    );

    await sendEmail(newUser.email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await usersService.findUserByElement({ verificationToken });

    if (user === null) {
      return next(HttpError(404, "User not found"));
    }

    await usersService.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });

    return next(HttpError(200, "Verification successful"));
  } catch (error) {
    next(error);
  }
};

export const resendingVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (Object.keys(req.body).length !== 1 || !req.body.email) {
      return next(HttpError(400, "Body must have one field: email"));
    }

    const user = await usersService.findUserByElement({ email });

    if (user === null) {
      return next(HttpError(404, "User not found"));
    }

    if (user.verify === true) {
      return next(HttpError(400, "Verification has already been passed"));
    }

    await sendEmail(user.email, user.verificationToken);

    return next(HttpError(200, "Verification email sent"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await usersService.findUserByElement({ email });

    if (user === null) {
      return next(HttpError(401, "Email or password is incorrect"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return next(HttpError(401, "Email or password is incorrect"));
    }

    if (user.verify === false) {
      return next(HttpError(401, "Please verify your email"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await usersService.updateUser(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersService.updateUser(req.user.id, { token: null });

    res.status(204).json({});
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const current = async (req, res, next) => {
  const _id = req.user.id;
  try {
    const user = await usersService.findUserByElement({ _id });

    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const updateSubscription = async (req, res, next) => {
  const _id = req.user.id;

  if (
    Object.keys(req.body).length !== 1 ||
    !["starter", "pro", "business"].includes(req.body.subscription)
  ) {
    return next(
      HttpError(
        400,
        "Body must have one field: subscription, with value 'starter', 'pro', or 'business'"
      )
    );
  }

  try {
    const user = await usersService.updateUser(_id, req.body);

    if (user) {
      res.status(200).json(user);
    } else {
      next(HttpError(404, "User not found"));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(HttpError(400, "File must have two field"));
    }
    const newPath = path.resolve("public", "avatars", req.file.filename);
    const avatarURL = path.join("/avatars", req.file.filename);

    const file = await Jimp.read(req.file.path);
    await file.resize(250, 250).quality(60).writeAsync(newPath);

    await fs.rename(req.file.path, newPath);

    const user = await usersService.updateUser(req.user.id, { avatarURL });

    if (user) {
      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } else {
      next(HttpError(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};
