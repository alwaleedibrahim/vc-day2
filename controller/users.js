import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../models/users.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const payload = {
      user_id: user._id,
      username: user.username,
      role: "user"
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.status(200).json({ message: "Success", data: { token } });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const {password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await users.create({ ...req.body, password: hashedPassword });
    res.status(200).json({ message: "Success", data: { user } });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const getِAll = async (req, res) => {
  try {
    const result = await users.find();
    if (!result) {
      return res.status(404).send({ message: "No users were found" });
    }
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: "Fail", error: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Success", data: { user } });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const del = async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await users.findByIdAndDelete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};
