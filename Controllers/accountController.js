import Account from "../models/Account.js";

export const list = async (req, res) => {
  const accounts = await Account.find({
    $or: [{ user: null }, { user: req.user._id }],
  });
  res.json(accounts);
};

export const create = async (req, res) => {
  const account = await Account.create({ ...req.body, user: req.user._id });
  res.status(201).json(account);
};

export const update = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!account) return res.status(404).json({ message: "Not found" });
  res.json(account);
};

export const remove = async (req, res) => {
  const deleted = await Account.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Account deleted" });
};
