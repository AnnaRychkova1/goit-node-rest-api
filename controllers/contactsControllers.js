import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  const id = req.params.id;
  try {
    const contact = await contactsService.getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const deleteContact = async (req, res, next) => {
  const id = req.params.id;
  try {
    const contact = await contactsService.removeContact(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const updateContact = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(HttpError(400, "Body must have at least one field"));
  }

  const id = req.params.id;
  try {
    const contact = await contactsService.updateContact(id, req.body);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};

export const updateStatusContact = async (req, res, next) => {
  const id = req.params.id;

  if (
    Object.keys(req.body).length !== 1 ||
    typeof req.body.favorite !== "boolean"
  ) {
    return next(HttpError(400, "Body must have one boolean field: favorite"));
  }

  try {
    const contact = await contactsService.updateStatusContact(id, req.body);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (err) {
    next(HttpError(500, "Server error"));
  }
};
