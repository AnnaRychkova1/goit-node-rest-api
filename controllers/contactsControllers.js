import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import mongoose from "mongoose";

export const getAllContacts = (req, res, next) => {
  contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};

export const getOneContact = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid contact id");
  }

  contactsService
    .getContactById(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        const error = HttpError(404);
        next(error);
      }
    })
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};

export const deleteContact = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid contact id");
  }

  contactsService
    .removeContact(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        const error = HttpError(404);
        next(error);
      }
    })
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};

export const createContact = (req, res, next) => {
  const { error } = createContactSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send(error.details.map((detail) => detail.message).join(", "));
  }

  const { name, email, phone } = req.body;
  contactsService
    .addContact(name, email, phone)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};

export const updateContact = (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send(error.details.map((detail) => detail.message).join(", "));
  }

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid contact id");
  }

  contactsService
    .updateContact(id, req.body)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        const error = HttpError(404);
        next(error);
      }
    })
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};

export const updateStatusContact = (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send(error.details.map((detail) => detail.message).join(", "));
  }

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid contact id");
  }

  if (
    Object.keys(req.body).length !== 1 ||
    typeof req.body.favorite !== "boolean"
  ) {
    throw HttpError(400, "Body must have one boolean field: favorite");
  }

  contactsService
    .updateStatusContact(id, req.body)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        const error = HttpError(404);
        next(error);
      }
    })
    .catch((err) => {
      const error = HttpError(500, "Server error");
      next(error);
    });
};
