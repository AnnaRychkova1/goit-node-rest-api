import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = (req, res) => {
  contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => {
      const error = new HttpError(500, err.message);
      next(error);
    });
};

export const getOneContact = (req, res) => {
  const id = req.params.id;
  contactsService
    .getContactById(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => {
      const error = new HttpError(500, err.message);
      next(error);
    });
};

export const deleteContact = (req, res) => {
  const id = req.params.id;
  contactsService
    .removeContact(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => {
      const error = new HttpError(500, err.message);
      next(error);
    });
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  contactsService
    .addContact(name, email, phone)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => {
      const error = new HttpError(500, err.message);
      next(error);
    });
};

export const updateContact = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsService
    .updateContact(req.params.id, req.body)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => {
      const error = new HttpError(500, err.message);
      next(error);
    });
};
