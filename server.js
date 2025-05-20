import express from "express";
import cors from 'cors';
import loginRoutes from './routes/user/loginRoutes.js';
import trainingsRoutes from './routes/trainings/trainingPlansRoutes.js';
import trainingDaysRoutes from './routes/trainings/trainingDaysRoutes.js';
import exercisesInDay from './routes/trainings/trainingDayExerciseRoutes.js'
import exerciseLibrary from './routes/trainings/exerciseLibraryRoutes.js'
import userProfile from './routes/user/userRoutes.js'
import { errorHandler } from './middleware/errorHandler.js';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const allowedOrigins = {
  development: [
    "http://localhost:3000", 
    "http://192.168.0.106:3000", 
    "http://192.168.0.4:3000"
  ],
  production: [
    "https://sportappclient-production3.up.railway.app"
  ]
};

app.use(cors({
  origin: function (origin, callback) {
    const env = process.env.NODE_ENV || 'development';
    const isAllowed = allowedOrigins[env].includes(origin);
    if (!origin || isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));

// Routes
app.use('/api', loginRoutes);
app.use('/api', trainingsRoutes);
app.use('/api', trainingDaysRoutes);
app.use('/api', exercisesInDay);
app.use('/api', exerciseLibrary);
app.use('/api', userProfile);

// CORS logginning
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('❌ Not allowed by CORS')) {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed' });
  }
  next(err);
});

app.use(errorHandler);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});