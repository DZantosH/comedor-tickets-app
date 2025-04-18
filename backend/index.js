const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// 👉 Asegúrate de que esta línea esté presente:
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes); // <--- Esta es la que enlaza /auth con las rutas

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
