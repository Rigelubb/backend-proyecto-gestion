const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todos los trabajos en el backlog
 * @route GET /backlog
 * @returns {object} 200 - Lista de trabajos en el backlog
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const backlogSnapshot = await db.collection('Backlog').get();
    const backlog = [];
    backlogSnapshot.forEach(doc => backlog.push({ id: doc.id, ...doc.data() }));
    res.json(backlog);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Agregar un nuevo trabajo al backlog
 * @route POST /backlog
 * @returns {object} 201 - Trabajo agregado
 * @returns {Error} 500 - Error interno del servidor
 */
router.post('/', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  try {
    const newJob = req.body;
    await db.collection('Backlog').add(newJob);
    res.status(201).send('Job added');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
