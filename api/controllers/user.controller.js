import User from "../models/user.model.js";
import { createError } from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can only delete your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("User has been deleted successfully!");
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).send(user);
  } else {
    next(createError(404, "User not found!"));
  }
};
