import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      next(
        HttpError(400, error.details.map((error) => error.message).join(", "))
      );
    }
    next();
  };

  return func;
};

export default validateBody;
