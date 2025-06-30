const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token invalide' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupération de l'utilisateur en base
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    if (user.admin === 0) return res.status(403).json({ error: 'Accès non autorisé' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
}

module.exports = authMiddleware;
