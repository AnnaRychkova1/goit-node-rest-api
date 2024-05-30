import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import * as fs from "node:fs/promises";
import path from "node:path";

import usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const isUser = await usersService.findUser(email);

    if (isUser !== null) {
      return next(HttpError(409, "Email in use"));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { s: "200", d: "retro" });

    const newUser = await usersService.createUser(
      email,
      passwordHash,
      avatarURL
    );

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

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await usersService.findUser(email);

    if (user === null) {
      return next(HttpError(401, "Email or password is incorrect"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return next(HttpError(401, "Email or password is incorrect"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await usersService.setUserToken(user._id, { token });

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
    await usersService.setUserToken(req.user.id, { token: null });

    res.status(204).json({});
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const current = async (req, res, next) => {
  const id = req.user.id;
  try {
    const user = await usersService.findUserById(id);

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
  const id = req.user.id;

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
    const user = await usersService.updateUserSubscription(id, req.body);

    if (user) {
      res.status(200).json(user);
    } else {
      next(HttpError(404));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    const newPath = path.resolve("public", "avatars", req.file.filename);

    Jimp.read(req.file.path)
      .then((file) => {
        return file.resize(250, 250).quality(60).write(newPath);
      })
      .catch((err) => {
        console.error(err);
      });

    await fs.rename(req.file.path, newPath);

    try {
      const user = await usersService.updateAvatar(
        req.user.id,
        req.file.filename
      );

      if (user) {
        res.status(200).json({
          avatarURL: user.avatarURL,
        });
      } else {
        next(HttpError(404));
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
