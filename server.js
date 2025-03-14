import express from "express";
import cors from 'cors';
// import userRoutes from "./routes/userRoutes.js";
import loginRoutes from './routes/user/accountManipulationRoutes.js';
import trainingsRoutes from './routes/trainings/trainingPlansRoutes.js';
import trainingDaysRoutes from './routes/trainings/trainingDaysRoutes.js';
import exercisesInDay from './routes/trainings/trainingDayExerciseRoutes.js'
import exerciseLibrary from './routes/trainings/trainingLibraryRoutes.js'
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000", // локальний сервер для розробки
    "http://192.168.0.106:3000", // локальна IP-адреса для розробки
    "https://sportappclient-production.up.railway.app" // адреса вашого клієнта на Railway
  ], // Дозволені домени
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Authorization", "Content-Type"]
}));

// Logging middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   next();
// });

// Routes
app.use('/api', loginRoutes);
app.use('/api', trainingsRoutes);
app.use('/api', trainingDaysRoutes);
app.use('/api', exercisesInDay);
app.use('/api', exerciseLibrary);

// Listen for all requests in local network
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});