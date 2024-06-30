const express = require('express');
const router = express.Router();
const { db } = require('./utils/firebase');
const { roleMiddleware } = require('./utils/middlewares');

/**
 * Obtener el programa semanal
 * @route GET /programa-semanal
 * @returns {object} 200 - Programa semanal
 * @returns {Error} 500 - Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const programaSnapshot = await db.collection('ProgramaSemanal').get();
    const programa = [];
    programaSnapshot.forEach(doc => programa.push({ id: doc.id, ...doc.data() }));
    res.json(programa);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Actualizar el estado de una operación en el programa semanal
 * @route PUT /programa-semanal/:id
 * @returns {object} 200 - Operación actualizada
 * @returns {Error} 500 - Error interno del servidor
 */
router.put('/:id', roleMiddleware(['admin', 'planificador']), async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    await db.collection('ProgramaSemanal').doc(id).update(updates);
    res.status(200).send('Operation updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
