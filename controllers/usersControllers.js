import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const newUser = await usersService.createUser(email, passwordHash);

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

    await usersService.setUserToken(user._id, { token }, { new: true });

    res.status(201).json({
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
    await usersService.setUserToken(
      req.user.id,
      { token: null },
      { new: true }
    );

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
