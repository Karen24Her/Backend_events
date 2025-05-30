import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import eventsRoutes from './routes/events.js';
import reservationsRoutes from './routes/reservations.js';

const app = express();

// back se entiende con express
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/events', eventsRoutes);
app.use('/reservations', reservationsRoutes);

//usar las rutas
app.use("/api", authRoutes)
app.use(clientRoutes)

export default app