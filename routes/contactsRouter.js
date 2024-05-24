import express from "express";

import isValidId from "../helpers/isValidId.js";
import validateBody from "../helpers/validateBody.js";
import * as schema from "../schemas/contactsSchemas.js";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post(
  "/",
  validateBody(schema.createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(schema.updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(schema.updateContactSchema),
  updateStatusContact
);

export default contactsRouter;
