const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// Ruta para procesar una compra
router.post('/compra', compraController.procesarCompra);

// Ruta para que el frontend obtenga todas las transacciones de un usuario
router.get('/transacciones/:cedula:precio:banco', compraController.getTransaccionesPorCedula);

// Ruta para recibir la respuesta de la pasarela de pago
router.post('/respuesta-pago', compraController.recibirRespuestaPago);

module.exports = router;