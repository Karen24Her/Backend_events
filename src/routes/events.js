import express from 'express';
import Event from '../models/event.js';
import {authRequired} from '../middleware/validateToken.js'
import {validateSchema} from '../middleware/validatorMiddleware.js'

const router = express.Router();

// GET /events - listar todos (solo usuarios autenticados)
router.get('/', authRequired, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos' });
  }
});

// POST /events - crear evento (solo usuarios autenticados)
router.post('/', authRequired, async (req, res) => {
  try {
    const { title, description, date, maxCapacity } = req.body;
    const newEvent = new Event({ title, description, date, maxCapacity });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear evento', error: error.message });
  }
});

// GET /events/:id - obtener evento por id (solo usuarios autenticados)
router.get('/:id', authRequired, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'ID inválido' });
  }
});

// PUT /events/:id - actualizar evento (solo usuarios autenticados)
router.put('/:id', authRequired, async (req, res) => {
  try {
    const { title, description, date, maxCapacity } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.maxCapacity = maxCapacity ?? event.maxCapacity;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar evento', error: error.message });
  }
});

// DELETE /events/:id - eliminar evento (solo usuarios autenticados)
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar evento' });
  }
});

export default router;
