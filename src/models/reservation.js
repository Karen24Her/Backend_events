import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
