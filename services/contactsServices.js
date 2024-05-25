import { Contact } from "../schemas/contacts.js";

async function listContacts(owner) {
  return Contact.find({ owner });
}

async function getContactById(contactId, owner) {
  return Contact.findOne({ _id: contactId, owner });
}

async function removeContact(contactId, owner) {
  return Contact.findOneAndDelete({ _id: contactId, owner });
}

async function addContact(name, email, phone, owner) {
  return Contact.create({ name, email, phone, owner });
}

async function updateContact(contactId, owner, body) {
  return Contact.findOneAndUpdate({ _id: contactId, owner }, body, {
    returnDocument: "after",
  });
}

async function updateStatusContact(contactId, owner, body) {
  return Contact.findOneAndUpdate({ _id: contactId, owner }, body, {
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
