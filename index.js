require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const roomsRouter = require('./routes/rooms');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const { PrismaClient } = require('@prisma/client');


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/rooms', roomsRouter);

app.get('/', (req, res) => {
  res.send('Serveur OK 👍');
});


app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Vous êtes connecté en tant que user ${req.userId}` });
});


app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});