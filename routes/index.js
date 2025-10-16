import express from 'express'
import connectDB from '../libs/database.js';
import dotenv  from 'dotenv'
import authRoutes from './authRoutes.js';
import categroyRoutes from './categoryRoutes.js';
import accountRoutes from './accountRoutes.js';
import TranscationRoutes from './transcationRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());

connectDB()

app.get("/" , (req , res) => {
    res.json({message : "api is running..."})
})
app.use("/api/auth", authRoutes);
app.use("/api/categories", categroyRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", TranscationRoutes);

export default app;
