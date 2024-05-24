import { Contact } from "../schemas/contacts.js";

async function listContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function addContact(name, email, phone) {
  return Contact.create({ name, email, phone });
}

async function updateContact(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, body, {
    returnDocument: "after",
  });
}

async function updateStatusContact(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, body, {
    returnDocument: "after",
  });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
