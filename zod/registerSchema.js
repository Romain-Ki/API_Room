const { z } = require('zod');

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

module.exports = registerSchema;