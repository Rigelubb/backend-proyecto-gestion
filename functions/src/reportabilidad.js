const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener todos los reportes
 * @route GET /reportabilidad
 * @returns {object} 200 - Lista de reportes
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', roleMiddleware(['admin', 'planificador', 'supervisor']), async (req, res) => {
  try {
    const reportesSnapshot = await db.collection('Reportes').get();
    const reportes = [];
    reportesSnapshot.forEach(doc => reportes.push({ id: doc.id, ...doc.data() }));
    res.json(reportes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Agregar un nuevo reporte
 * @route POST /reportabilidad
 * @returns {object} 201 - Reporte agregado
 * @returns {Error} 500 - Error interno del servidor
 */
router.post('/', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  try {
    const newReport = req.body;
    await db.collection('Reportes').add(newReport);
    res.status(201).send('Report added');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

