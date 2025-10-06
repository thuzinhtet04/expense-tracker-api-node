import Category from "../models/Category.js";

export const list = async (req, res) => {
  const categories = await Category.find({
    $or: [{ user: null }, { user: req.user._id }],
  });
  res.json(categories);
};

export const create = async (req, res) => {
  const category = await Category.create({ ...req.body, user: req.user._id });
  res.status(201).json(category);
};

export const update = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json(category);
};

export const remove = async (req, res) => {
  const deleted = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Category deleted" });
};
