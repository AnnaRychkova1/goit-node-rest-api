import { User } from "../schemas/users.js";

async function findUser(email) {
  return User.findOne({ email });
}

async function createUser(email, password, avatarURL) {
  return User.create({ email, password, avatarURL });
}

async function setUserToken(_id, token) {
  return User.findByIdAndUpdate({ _id }, token, { new: true });
}

async function findUserById(_id) {
  return User.findById({ _id });
}

async function updateUserSubscription(_id, body) {
  return User.findByIdAndUpdate({ _id }, body, { new: true });
}

async function updateAvatar(_id, avatarURL) {
  return User.findByIdAndUpdate({ _id }, { avatarURL }, { new: true });
}

export default {
  findUser,
  createUser,
  setUserToken,
  findUserById,
  updateUserSubscription,
  updateAvatar,
};
