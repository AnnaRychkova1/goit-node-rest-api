import { User } from "../schemas/users.js";

async function findUser(email) {
  return User.findOne({ email });
}

async function createUser(email, passwordHash) {
  return User.create({ email, password: passwordHash });
}

export async function setUserToken(id, token) {
  return User.findByIdAndUpdate({ _id: id }, token);
}

export async function findUserById(_id) {
  return User.findById({ _id });
}

export default { findUser, createUser, setUserToken, findUserById };
