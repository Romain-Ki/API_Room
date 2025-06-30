const { z } = require('zod');

const bookingSchema = z.object({
  roomId: z.number().int().positive(),
  start: z.string().datetime(), // Valide une date au format ISO (ex: "2025-07-01T10:00:00.000Z")
  end: z.string().datetime(),
}).refine(data => new Date(data.start) < new Date(data.end), {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end"], // Erreur associée au champ 'end'
});

module.exports = bookingSchema;