const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todas las operaciones sin asignar del backlog
 * @route GET /back-asignar
 * @returns {object} 200 - Lista de operaciones sin asignar
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const backAsignarSnapshot = await db.collection('BackAsignar').where('estado', '==', 'sin_asignar').get();
    const backAsignar = [];
    backAsignarSnapshot.forEach(doc => backAsignar.push({ id: doc.id, ...doc.data() }));
    res.json(backAsignar);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Asignar una operación del backlog a un día específico
 * @route PUT /back-asignar/:id
 * @returns {object} 200 - Operación asignada
 * @returns {Error} 500 - Error interno del servidor
 */
router.put('/:id', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  const id = req.params.id;
  const { diaAsignado } = req.body;
  try {
    await db.collection('BackAsignar').doc(id).update({ diaAsignado, estado: 'asignado' });
    res.status(200).send('Operation assigned');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
