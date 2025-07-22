const express = require('express');
const router = express.Router();

// Endpoint de la pasarela de pago
router.post('/pago', async (req, res) => {
  const { transactionId, precio_total, cedula } = req.body;
  
  if (!transactionId || !precio_total || !cedula) {
    return res.status(400).json({ 
      success: false,
      message: 'Datos incompletos para procesar el pago'
    });
  }
  
  try {
    // Aquí iría la lógica real de comunicación con el banco o pasarela de pago
    // Por ahora, simulamos una respuesta exitosa
    
    // Simulamos que las transacciones con monto mayor a 1000 son rechazadas
    const success = precio_total <= 1000;
    
    return res.status(200).json({
      success: success,
      status: success ? 'APROBADO' : 'RECHAZADO',
      message: success ? 'Pago procesado correctamente' : 'Pago rechazado por monto excesivo',
      transactionId: transactionId
    });
  } catch (error) {
    console.error('Error en la pasarela de pago:', error);
    return res.status(500).json({
      success: false,
      status: 'ERROR',
      message: 'Error al procesar el pago'
    });
  }
});

module.exports = router;