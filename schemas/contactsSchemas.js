import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .message("Ім'я має бути мінімум 3 символи!")
    .required()
    .messages({ "any.required": "Ім'я є обов'язковим полем" }),
  email: Joi.string()
    .email()
    .message("Невірний формат електронної адреси")
    .required()
    .messages({ "any.required": "Email є обов'язковим полем" }),
  phone: Joi.string()
    .pattern(/^\+380\d{9}$/)
    .message("Невірний формат - номер має бути +380.........")
    .required()
    .messages({ "any.required": "Телефон є обов'язковим полем" }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).message("Ім'я має бути мінімум 3 символи!"),
  email: Joi.string().email().message("Невірний формат електронної адреси"),
  phone: Joi.string()
    .pattern(/^\+380\d{9}$/)
    .message("Невірний формат - номер має бути +380........."),
});
