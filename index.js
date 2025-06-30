require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// GET /users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const user = await prisma.user.create({ data: validatedData });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

const roomsRouter = require('./routes/rooms');
app.use('/rooms', roomsRouter);

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});

app.listen(3000, () => {
  console.log('✅ Serveur lancé sur http://localhost:3000');
});
