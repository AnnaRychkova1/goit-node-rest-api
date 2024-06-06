import { User } from "../schemas/users.js";

async function findUserByElement(element) {
  return User.findOne(element);
}

async function createUser(email, password, avatarURL, verificationToken) {
  return User.create({ email, password, avatarURL, verificationToken });
}

async function updateUser(_id, body) {
  return User.findByIdAndUpdate({ _id }, body, { new: true });
}

export default {
  findUserByElement,
  createUser,
  updateUser,
};
