const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middlewares/authMiddleware'); // ton middleware complet
const authAdmin = require('../middlewares/adminMiddleware');
const roomSchema = require('../zod/roomSchema')

// GET /rooms - accessible aux utilisateurs connectés
router.get('/', auth, async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

// POST /rooms - accessible uniquement aux admin
router.post('/', authAdmin, async (req, res) => {
  try {
    const validatedData = roomSchema.parse(req.body); // <-- validation ici

    const room = await prisma.room.create({
      data: validatedData,
    });

    res.status(201).json(room);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /rooms/:id - accessible aux utilisateurs connectés
router.get('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return res.status(404).json({ error: 'Salle non trouvée' });
  }
  res.json(room);
});

module.exports = router;
