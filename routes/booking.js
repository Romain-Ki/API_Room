// Dans routes/bookingRoutes.js
import { Router } from 'express';
// Importer les middlewares et contrôleurs que vous allez créer
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getBookings, createBooking } from '../controllers/bookingController.js';
import { validateRoomRules } from '../middlewares/dynamicConstraintsMiddleware.js';

const router = Router();

// Route pour lister les réservations de l'utilisateur (ou toutes pour un admin)
router.get('/bookings', isAuthenticated, getBookings);

// Route pour créer une réservation
// Notez l'enchaînement des middlewares : authentification, puis validation des règles, puis contrôleur final
router.post('/bookings', isAuthenticated, validateRoomRules, createBooking);

export default router;