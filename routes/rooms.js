const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middlewares/authMiddleware'); // ton middleware complet
const authAdmin = require('../middlewares/adminMiddleware');

// GET /rooms - accessible aux utilisateurs connectés
router.get('/', auth, async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

// POST /rooms - accessible uniquement aux admin
router.post('/', authAdmin, async (req, res) => {
  try {
    const roomData = req.body;
    const room = await prisma.room.create({ data: roomData });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});;

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
