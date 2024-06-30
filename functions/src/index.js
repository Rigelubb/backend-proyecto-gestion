// functions/src/index.js
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { authMiddleware, roleMiddleware } = require('./utils/middlewares');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/auth', require('./auth'));

app.use(authMiddleware);

app.use('/backlog', require('./backlog'));
app.use('/back-asignar', roleMiddleware(['admin', 'planificador']), require('./backAsignar'));
app.use('/programa-semanal', roleMiddleware(['admin', 'planificador', 'supervisor']), require('./programaSemanal'));
app.use('/reportabilidad', roleMiddleware(['admin', 'planificador', 'supervisor']), require('./reportabilidad'));
app.use('/usuarios', roleMiddleware(['admin']), require('./usuarios'));
app.use('/trabajos', roleMiddleware(['admin', 'planificador']), require('./trabajos'));
app.use('/operaciones', roleMiddleware(['admin', 'planificador']), require('./operaciones'));

exports.api = functions.https.onRequest(app);
   