import { Schema, model } from "mongoose";
import Joi from "joi";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Set name for contact"],
    },
  },
  { versionKey: false, timestamps: false }
);

const createContactSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Ім'я має бути мінімум 3 символи!",
    "any.required": "Ім'я є обов'язковим полем",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Невірний формат електронної адреси",
    "any.required": "Email є обов'язковим полем",
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Невірний формат - номер має бути (123) 456-7890",
      "any.required": "Телефон є обов'язковим полем",
    }),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).messages({
    "string.min": "Ім'я має бути мінімум 3 символи!",
  }),
  email: Joi.string().email().messages({
    "string.email": "Невірний формат електронної адреси",
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({
      "string.pattern.base": "Невірний формат - номер має бути (123) 456-7890",
    }),
  favorite: Joi.boolean(),
});

export const Contact = model("Contact", contactSchema);

export { createContactSchema, updateContactSchema };
