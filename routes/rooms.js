const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /rooms - liste toutes les salles
router.get('/', async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

// POST /rooms - crée une salle (admin seulement — ici, pas d’auth, juste un exemple)
router.post('/', async (req, res) => {
  try {
    const roomData = req.body; // à valider avec Zod idéalement
    const room = await prisma.room.create({ data: roomData });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /rooms/:id - détail d’une salle
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return res.status(404).json({ error: 'Salle non trouvée' });
  }
  res.json(room);
});

module.exports = router;
