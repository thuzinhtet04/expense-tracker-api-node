import Category from "../models/Category.js";
import Account from "../models/Account.js";

async function seedDefaults(id, session) {
  const categories = [
    { name: "General Income", type: "income", user: id },
    { name: "General Expense", type: "expense", user: id },
    { name: "Food", type: "expense", user: id },
    { name: "Salary", type: "income", user: id },
  ];

  const accounts = [
    { name: "Cash", type: "default", currency: "MMK", user: id },
    { name: "E-Wallet", type: "digital", currency: "MMK", user: id },
    { name: "Bank Account", type: "bank", currency: "MMK", user: id },
  ];

  await Category.insertMany(categories, { session });

  await Account.insertMany(accounts, { session });

  console.log("✅ Global defaults ready");
}

export default seedDefaults;
