import express from 'express';
import Reservation from '../models/reservation.js';
import Event from '../models/event.js';
import {authRequired} from '../middleware/validateToken.js'
import {validateSchema} from '../middleware/validatorMiddleware.js'

const router = express.Router();

// GET /reservations - Obtener reservas del usuario autenticado
router.get('/', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ userId }).populate('eventId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// POST /reservations - Crear reserva (con validaciones)
router.post('/', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    if (event.reservationsCount >= event.maxCapacity) {
      return res.status(400).json({ message: 'El evento está completo' });
    }

    const existingReservation = await Reservation.findOne({ userId, eventId });
    if (existingReservation) {
      return res.status(400).json({ message: 'Ya tienes una reserva para este evento' });
    }

    const newReservation = new Reservation({ userId, eventId });
    await newReservation.save();

    // Actualizamos el contador de reservas en el evento
    event.reservationsCount++;
    await event.save();

    res.status(201).json({ message: 'Reserva creada exitosamente', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear reserva', error: error.message });
  }
});

// DELETE /reservations/:id - Cancelar reserva (solo del usuario dueño)
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

    if (reservation.userId.toString() !== userId) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta reserva' });
    }

    const event = await Event.findById(reservation.eventId);
    if (event && event.reservationsCount > 0) {
      event.reservationsCount--;
      await event.save();
    }

    await reservation.deleteOne();

    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar reserva', error: error.message });
  }
});

export default router;
