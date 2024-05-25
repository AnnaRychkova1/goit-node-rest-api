import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const userCreateSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Пароль може містити тільки літери та цифри і має бути довжиною від 5 до 30 символів",
      "any.required": "Пароль є обов'язковим полем",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Невірний формат електронної адреси",
    "any.required": "Email є обов'язковим полем",
  }),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Тип підписки має бути одним з варіантів: starter, pro або business",
  }),
});

const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Тип підписки має бути одним з варіантів: starter, pro або business",
  }),
});

export const User = model("User", userSchema);

export { userCreateSchema, userUpdateSubscriptionSchema };
