import { Contact } from "../schemas/contacts.js";

async function listContacts(owner, page = 2, limit = 20, favorite) {
  const skip = (page - 1) * limit;
  const filter = { owner };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }
  return Contact.find(filter).skip(skip).limit(limit);
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

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
