import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = allContacts[index];
  allContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, undefined, 2));

  return removedContact;
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();

  const newContact = { id: crypto.randomUUID(), name, email, phone };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, undefined, 2));
  return newContact;
}

async function updateContact(id, body) {
  const allContacts = await listContacts();

  const index = allContacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }

  allContacts[index] = { ...allContacts[index], ...body };

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

  console.log(allContacts[index]);

  return allContacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
