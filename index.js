const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const compraRoutes = require('./routes/compra');
const pagoRoutes = require('./routes/pago');

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(cors({
  origin: ['https://my-app-next-rho.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api', compraRoutes);
app.use('', pagoRoutes); // La pasarela de pago está en la raíz

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Ecommerce funcionando correctamente' });
});

// Ruta para verificar la conexión con el frontend
app.get('/api/check-connection', (req, res) => {
  res.json({
    status: 'success',
    message: 'Conexión establecida con el backend',
    timestamp: new Date().toISOString(),
    frontend: req.headers.origin || 'Unknown'
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});