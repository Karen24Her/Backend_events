import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import eventsRoutes from './routes/events.js';
import reservationsRoutes from './routes/reservations.js';

const app = express();

//configuracio cors
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// back se entiende con express
app.use(express.json())
app.use(cookieParser())
app.use('/api/events', eventsRoutes);
app.use('/api/reservations', reservationsRoutes);

//usar las rutas
app.use("/api", authRoutes)
app.use(clientRoutes)

export default app