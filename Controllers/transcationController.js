import Transcation from "../models/Transcation.js"
import Category from "../models/Category.js"
import Account from "../models/Account.js"


/**
 * 📜 List all user transactions
 */
export const list = async (req, res) => {
  const txns = await Transcation.find({ user: req.user._id })
    .populate("category account")
    .sort({ date: -1 });
    if(txns.length === 0 ){
        res.json({message : "There is no transaction available"}).status(200)
    }
  res.json(txns);
};

/**
 * ➕ Create a new transaction (income or expense)
 * Updates the account balance accordingly.
 */
export const create = async (req, res) => {
  try {
    const { category: categoryId, account: accountId, amount } = req.body;

    // ✅ Validate category
    const category = await Category.findOne({
      _id: categoryId,
      $or: [{ user: req.user._id }, { user: null }],
    });
    if (!category) return res.status(400).json({ message: "Invalid category" });

    // ✅ Validate account
    const account = await Account.findOne({
      _id: accountId,
      $or: [{ user: req.user._id }, { user: null }],
    });
    if (!account) return res.status(400).json({ message: "Invalid account" });

    // ✅ Create transaction
    const txn = await Transcation.create({ ...req.body, user: req.user._id });

    // ✅ Adjust balance
    if (category.type === "income") account.balance += amount;
    if (category.type === "expense") account.balance -= amount;
    await account.save();

    res.status(201).json(txn);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/**
 * ✏️ Update a transaction
 * Handles both transaction data AND balance adjustment if amount/account changes.
 */
export const update = async (req, res) => {
  try {
    const txn = await Transcation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!txn) return res.status(404).json({ message: "Transcation not found" });

    // Find old account and category
    const oldAccount = await Account.findById(txn.account);
    const oldCategory = await Category.findById(txn.category);

    // Reverse the previous balance effect
    if (oldCategory.type === "income") oldAccount.balance -= txn.amount;
    if (oldCategory.type === "expense") oldAccount.balance += txn.amount;
    await oldAccount.save();

    // Find new category and account (can change)
    const newCategory = await Category.findOne({
      _id: req.body.category || txn.category,
      $or: [{ user: req.user._id }, { user: null }],
    });
    if (!newCategory)
      return res.status(400).json({ message: "Invalid new category" });

    const newAccount = await Account.findOne({
      _id: req.body.account || txn.account,
      $or: [{ user: req.user._id }, { user: null }],
    });
    if (!newAccount)
      return res.status(400).json({ message: "Invalid new account" });

    // Update transaction fields
    txn.category = req.body.category || txn.category;
    txn.account = req.body.account || txn.account;
    txn.amount = req.body.amount ?? txn.amount;
    txn.note = req.body.note ?? txn.note;
    txn.date = req.body.date ?? txn.date;
    await txn.save();

    // Apply new balance effect
    if (newCategory.type === "income") newAccount.balance += txn.amount;
    if (newCategory.type === "expense") newAccount.balance -= txn.amount;
    await newAccount.save();

    res.json(txn);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/**
 * ❌ Delete a transaction
 * Reverses the balance effect on the linked account.
 */
export const remove = async (req, res) => {
  try {
    const txn = await Transcation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!txn) return res.status(404).json({ message: "Transcation not found" });

    const category = await Category.findById(txn.category);
    const account = await Account.findById(txn.account);

    // Reverse balance impact
    if (category.type === "income") account.balance -= txn.amount;
    if (category.type === "expense") account.balance += txn.amount;
    await account.save();

    await txn.deleteOne();
    res.json({ message: "Transcation deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
