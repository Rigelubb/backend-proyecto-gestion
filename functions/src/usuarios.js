const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todos los usuarios
 * @route GET /usuarios
 * @returns {object} 200 - Lista de usuarios
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', roleMiddleware(['admin']), async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('Usuarios').get();
    const usuarios = [];
    usuariosSnapshot.forEach(doc => usuarios.push({ id: doc.id, ...doc.data() }));
    res.json(usuarios);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Agregar un nuevo usuario
 * @route POST /usuarios
 * @returns {object} 201 - Usuario agregado
 * @returns {Error} 500 - Error interno del servidor
 */
router.post('/', roleMiddleware(['admin']), async (req, res) => {
  try {
    const newUser = req.body;
    await db.collection('Usuarios').add(newUser);
    res.status(201).send('User added');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
