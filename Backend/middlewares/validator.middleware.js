export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Si el error viene de Zod
    if (error?.errors && Array.isArray(error.errors)) {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }

    // Si el error es otro tipo
    return res.status(400).json({ error: "Error de validación desconocido." });
  }
};
