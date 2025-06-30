require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/booking');
const authMiddleware = require('./middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Serveur OK 👍');
});

// 🟢 Routes publiques (ex: login, register)
app.use('/auth', authRoutes);

// 🔐 Middleware d'auth appliqué à tout ce qui suit
app.use(authMiddleware);

// 🔒 Toutes les routes après ici sont protégées
app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

app.get('/profile', (req, res) => {
  res.json({ message: `Vous êtes connecté en tant que user ${req.userId}` });
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
