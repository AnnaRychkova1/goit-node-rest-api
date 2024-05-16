import { Contact } from "../schemas/contacts.js";

async function listContacts() {
  return await Contact.find();
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function removeContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

async function updateContact(contactId, body) {
  return await Contact.findByIdAndUpdate(contactId, body, {
    returnDocument: "after",
  });
}

async function updateStatusContact(contactId, body) {
  return await Contact.findByIdAndUpdate(contactId, body, {
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
