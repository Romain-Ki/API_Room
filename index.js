require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const { z } = require('zod');


app.use(express.json());
app.use('/auth', authRoutes);

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

app.get('/', (req, res) => {
  res.send('Serveur OK 👍');
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Vous êtes connecté en tant que user ${req.userId}` });
});


app.listen(3000, () => {
  console.log('✅ Serveur lancé sur http://localhost:3000');
});
