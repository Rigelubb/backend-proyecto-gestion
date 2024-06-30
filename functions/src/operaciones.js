const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todas las operaciones
 * @route GET /operaciones
 * @returns {object} 200 - Lista de operaciones
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', roleMiddleware(['admin', 'planificador', 'supervisor']), async (req, res) => {
  try {
    const operacionesSnapshot = await db.collection('Operaciones').get();
    const operaciones = [];
    operacionesSnapshot.forEach(doc => operaciones.push({ id: doc.id, ...doc.data() }));
    res.json(operaciones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Agregar una nueva operación
 * @route POST /operaciones
 * @returns {object} 201 - Operación agregada
 * @returns {Error} 500 - Error interno del servidor
 */
router.post('/', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  try {
    const newOperation = req.body;
    await db.collection('Operaciones').add(newOperation);
    res.status(201).send('Operation added');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Actualizar una operación existente
 * @route PUT /operaciones/:id
 * @returns {object} 200 - Operación actualizada
 * @returns {Error} 500 - Error interno del servidor
 */
router.put('/:id', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    await db.collection('Operaciones').doc(id).update(updates);
    res.status(200).send('Operation updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
