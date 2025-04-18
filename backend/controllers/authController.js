const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registro = async (req, res) => {
    const {
      nombres,
      apellido_paterno,
      apellido_materno,
      matricula,
      correo,
      contrasena
    } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
  
      await db.execute(
        'INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, matricula, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
        [nombres, apellido_paterno, apellido_materno, matricula, correo, hashedPassword]
      );
  
      res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  };
  
  

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;
    const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (usuarios.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = usuarios[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};