import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messsageRoutes from './routes/message.route.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/backend/auth', authRoutes);
app.use('/backend/messages', messsageRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})