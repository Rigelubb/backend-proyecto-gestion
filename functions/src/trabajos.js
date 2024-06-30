const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todos los trabajos
 * @route GET /trabajos
 * @returns {object} 200 - Lista de trabajos
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', roleMiddleware(['admin', 'planificador', 'supervisor']), async (req, res) => {
  try {
    const trabajosSnapshot = await db.collection('Trabajos').get();
    const trabajos = [];
    trabajosSnapshot.forEach(doc => trabajos.push({ id: doc.id, ...doc.data() }));
    res.json(trabajos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Obtener trabajos del día de hoy
 * @route GET /trabajos/hoy
 * @returns {object} 200 - Lista de trabajos del día de hoy
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/hoy', async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const trabajosSnapshot = await db.collection('Trabajos').where('diaAsignado', '==', hoy).get();
    const trabajos = [];
    trabajosSnapshot.forEach(doc => trabajos.push({ id: doc.id, ...doc.data() }));
    res.json(trabajos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Obtener trabajos del día de mañana
 * @route GET /trabajos/manana
 * @returns {object} 200 - Lista de trabajos del día de mañana
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/manana', async (req, res) => {
  try {
    const manana = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const trabajosSnapshot = await db.collection('Trabajos').where('diaAsignado', '==', manana).get();
    const trabajos = [];
    trabajosSnapshot.forEach(doc => trabajos.push({ id: doc.id, ...doc.data() }));
    res.json(trabajos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Agregar un nuevo trabajo
 * @route POST /trabajos
 * @returns {object} 201 - Trabajo agregado
 * @returns {Error} 500 - Error interno del servidor
 */
router.post('/', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  try {
    const newJob = req.body;
    await db.collection('Trabajos').add(newJob);
    res.status(201).send('Job added');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Actualizar un trabajo existente
 * @route PUT /trabajos/:id
 * @returns {object} 200 - Trabajo actualizado
 * @returns {Error} 500 - Error interno del servidor
 */
router.put('/:id', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    await db.collection('Trabajos').doc(id).update(updates);
    res.status(200).send('Job updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
