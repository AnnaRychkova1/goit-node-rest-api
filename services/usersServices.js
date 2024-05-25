import { User } from "../schemas/users.js";

async function findUser(email) {
  return User.findOne({ email });
}

async function createUser(email, passwordHash) {
  return User.create({ email, password: passwordHash });
}

async function setUserToken(id, token) {
  return User.findByIdAndUpdate({ _id: id }, token, {
    new: true,
  });
}

async function findUserById(_id) {
  return User.findById({ _id });
}

async function updateUserSubscription(id, body) {
  return User.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
}

export default {
  findUser,
  createUser,
  setUserToken,
  findUserById,
  updateUserSubscription,
};
