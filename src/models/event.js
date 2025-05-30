import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  maxCapacity: { type: Number, required: true },
  reservationsCount: { type: Number, default: 0 },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;  // <- Exporta por defecto
