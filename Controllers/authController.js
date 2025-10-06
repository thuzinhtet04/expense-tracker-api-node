import User from "../models/User.js";
import generateToken from "../libs/generateToken.js";
import seedDefaults from "../config/seedDefault.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 🔍 Step 0: Check if user already exists BEFORE starting transaction
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Start session *only if we need to create a new user*
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Create user
      const [user] = await User.create([{ email, password, name }], {
        session,
      });
      const userId = user._id;


      await seedDefaults(userId, session);

      // 4️⃣ Commit and end session
      await session.commitTransaction();
      session.endSession();

      // 5️⃣ Return success
      const token = generateToken(user);
      res.status(201).json({
        token,
        user: { id: userId, email, name },
      });
    } catch (error) {
      // Rollback inside transaction
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Transaction failed:", error.message);
      res.status(500).json({ message: "Registration failed, rolled back." });
    }
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user),
    user: { id: user._id, email: user.email, name: user.name },
  });
};
