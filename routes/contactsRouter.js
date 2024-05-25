import express from "express";

import isValidId from "../helpers/isValidId.js";
import validateBody from "../helpers/validateBody.js";
import * as schema from "../schemas/contacts.js";
import authMiddleware from "../middlewares/auth.js";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, isValidId, getOneContact);

contactsRouter.delete("/:id", authMiddleware, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authMiddleware,
  validateBody(schema.createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authMiddleware,
  isValidId,
  validateBody(schema.updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authMiddleware,
  isValidId,
  updateStatusContact
);

export default contactsRouter;
