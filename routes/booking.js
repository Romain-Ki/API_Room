const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('../middlewares/adminMiddleware');

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
  const { roomId, start, end } = req.body;
  const userId = req.user.id;

  if (!roomId || !start || !end) {
    return res.status(400).json({ error: "Les champs roomId, start et end sont requis." });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Salle non trouvée." });
    }

    const rules = room.rules || {};
    const bookingDuration = (endDate - startDate) / (1000 * 60); // Durée en minutes

    if (rules.maxDurationMinutes && bookingDuration > rules.maxDurationMinutes) {
      return res.status(400).json({ error: `La durée de réservation dépasse le maximum de ${rules.maxDurationMinutes} minutes.` });
    }
    if (rules.allowWeekends === false && (startDate.getDay() === 0 || startDate.getDay() === 6)) {
        return res.status(400).json({ error: "Les réservations ne sont pas autorisées le week-end pour cette salle." });
    }

    // 3. Vérification des conflits de réservation
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: roomId,
        AND: [
          { start: { lt: endDate } }, // La réservation existante commence avant que la nouvelle ne se termine
          { end: { gt: startDate } },   // ET la réservation existante se termine après que la nouvelle ne commence
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({ error: "Un conflit de réservation a été détecté. Le créneau est déjà pris." });
    }

    // 4. Création de la réservation
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
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;