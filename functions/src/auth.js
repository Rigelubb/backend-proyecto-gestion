// functions/src/auth.js
const express = require('express');
const router = express.Router();
const { auth, db } = require('./utils/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { correo, contrasena, nombre, rol } = req.body;
  try {
    if (!correo || !contrasena || !nombre || !rol) {
      return res.status(400).send('Todos los campos son obligatorios');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const userRef = db.collection('Usuarios').doc();
    await userRef.set({
      correo: correo,
      contrasena: hashedPassword,
      nombre: nombre,
      rol: rol
    });

    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para iniciar sesión con usuario y contraseña
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const userSnapshot = await db.collection('Usuarios').where('correo', '==', correo).get();
    if (userSnapshot.empty) {
      return res.status(401).send('Correo o contraseña inválidos');
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const passwordMatch = await bcrypt.compare(contrasena, userData.contrasena);

    if (!passwordMatch) {
      return res.status(401).send('Correo o contraseña inválidos');
    }

    const token = jwt.sign({ uid: userDoc.id, role: userData.rol }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { uid: userDoc.id, correo: userData.correo, nombre: userData.nombre, rol: userData.rol } });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para verificar el rol del usuario
router.get('/role', async (req, res) => {
  try {
    const uid = req.user.uid;
    const userRef = db.collection('Usuarios').doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      res.json({ role: userDoc.data().rol });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
