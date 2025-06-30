const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('../middlewares/adminMiddleware');
const bookingSchema = require('../zod/bookingSchema');

/**
 * GET /bookings - Liste les réservations.
 * - Si l'utilisateur est un ADMIN, renvoie toutes les réservations.
 * - Si l'utilisateur est un EMPLOYEE, renvoie uniquement ses propres réservations.
 */
router.get('/', admin, async (req, res) => {
  try {
    const user = req.user;
    const bookings = await prisma.booking.findMany({
      include: { user: true, room: true },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /bookings - Crée une nouvelle réservation.
 * Applique la logique de validation des règles et des conflits.
 */
router.post('/', async (req, res) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const { roomId, start, end } = validatedData;
    
    const userId = req.user.id;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Salle non trouvée." });
    }

    const rules = room.rules || {};
    const bookingDuration = (endDate - startDate) / (1000 * 60);

    if (rules.maxDurationMinutes && bookingDuration > rules.maxDurationMinutes) {
      return res.status(400).json({ error: `La durée de réservation dépasse le maximum de ${rules.maxDurationMinutes} minutes.` });
    }
    if (rules.allowWeekends === false && (startDate.getDay() === 0 || startDate.getDay() === 6)) {
        return res.status(400).json({ error: "Les réservations ne sont pas autorisées le week-end pour cette salle." });
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: roomId,
        AND: [
          { start: { lt: endDate } },
          { end: { gt: startDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({ error: "Un conflit de réservation a été détecté. Le créneau est déjà pris." });
    }

    const newBooking = await prisma.booking.create({
      data: {
        start: startDate,
        end: endDate,
        userId: userId,
        roomId: roomId,
      },
    });

    res.status(201).json(newBooking);

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Une erreur interne est survenue" });
  }
});

module.exports = router;