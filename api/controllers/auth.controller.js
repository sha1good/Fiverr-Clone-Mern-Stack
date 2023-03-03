import User from "../models/user.model.js";
import { createError } from "../utils/createError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const user = await User.findOne({ username: req.body.username });
    if (user) {
     return next(createError(400, "Username or Email already exist!"));
    }
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();
    res.status(201).send("User has been created!");
  } catch (error) {
    next(createError(error.status, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong Username or Password!"));
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res.cookie("accessToken", token, { httpOnly: true }).status(200).send(info);
  } catch (error) {
    next(createError(error.status, error.message));
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", { sameSite: "none", secure: true })
    .status(200)
    .send("User has been logout.!");
};
