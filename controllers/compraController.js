const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Controlador para recibir la respuesta de la pasarela de pago
exports.recibirRespuestaPago = async (req, res) => {
  const { transactionId, status } = req.body;
  
  if (!transactionId || !status) {
    return res.status(400).json({ error: 'TransactionId y status son campos requeridos' });
  }

  try {
    // Actualizar el estado de la transacción en la base de datos
    const query = 'UPDATE transacciones SET Estado_trans = $1 WHERE TransactionId = $2 RETURNING *';
    const result = await pool.query(query, [status, transactionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
    
    // Devolver código 200 si fue APROBADA o 418 si fue RECHAZADA
    if (status === 'APROBADO') {
      return res.status(200).json({
        message: 'Transacción aprobada',
        transaction: result.rows[0]
      });
    } else {
      return res.status(418).json({
        message: 'Transacción rechazada',
        transaction: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Error al procesar la respuesta de pago:', error);
    return res.status(500).json({ error: 'Error al procesar la respuesta' });
  }
};

// Controlador para obtener todas las transacciones de un usuario por cédula
exports.getTransaccionesPorCedula = async (req, res) => {
  const { cedula } = req.params;
  
  if (!cedula) {
    return res.status(400).json({ error: 'Cédula requerida' });
  }

  try {
    const query = 'SELECT * FROM transacciones WHERE Cedula = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [cedula]);
    
    return res.status(200).json({
      transacciones: result.rows
    });
  } catch (error) {
    console.error('Error al obtener las transacciones:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Controlador para obtener el estado de una transacción
exports.getTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;
  
  if (!transactionId) {
    return res.status(400).json({ error: 'ID de transacción requerido' });
  }

  try {
    const query = 'SELECT * FROM transacciones WHERE TransactionId = $1';
    const result = await pool.query(query, [transactionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
    
    return res.status(200).json({
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener el estado de la transacción:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Controlador para procesar una compra
exports.procesarCompra = async (req, res) => {
  const { cedula, precio_total, bank = 1 } = req.body; // Valor por defecto para bank
  
  if (!cedula || !precio_total) {
    return res.status(400).json({ error: 'Cedula y precio_total son campos requeridos' });
  }

  try {
    // Generar un ID de transacción único
    const transactionId = uuidv4();
    
    // Enviar datos a la pasarela de pago real
    const paymentGatewayResponse = await enviarAPasarelaPago({
      transactionId,
      precio_total,
      cedula
    });
    
    // Estado de la transacción según la respuesta de la pasarela
    const estado_trans = paymentGatewayResponse.status || (paymentGatewayResponse.success ? 'APROBADO' : 'RECHAZADO');
    
    // Guardar la transacción en la base de datos
    const query = `
      INSERT INTO transacciones (TransactionId, Cedula, Estado_trans, Precio_total)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [transactionId, cedula, estado_trans, precio_total];
    const result = await pool.query(query, values);
    
    return res.status(201).json({
      message: 'Transacción procesada',
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    return res.status(500).json({ error: 'Error al procesar la transacción' });
  }
};

// Función para enviar datos a la pasarela de pago real
async function enviarAPasarelaPago(data) {
  try {
    // Utilizamos axios para hacer la petición al endpoint real de la pasarela
    const response = await axios.post(process.env.PAYMENT_GATEWAY_URL || 'https://pasarela-433766410684.europe-west1.run.app/payment/process', {
      id_usuario: parseInt(data.cedula) || 1001, // Convertir a número o usar valor por defecto
      id_banco: parseInt(data.bank) || 1, // Convertir a número o usar valor por defecto
      id_cuenta: parseInt(data.transactionId.replace(/\D/g, '').substring(0, 5)) || 12345, // Extraer dígitos y usar los primeros 5
      monto: parseFloat(data.precio_total)
    });
    
    const responseData = response.data;
    // Adaptamos la respuesta de la pasarela al formato que espera nuestra aplicación
    return {
      success: responseData.status === 'APPROVED',
      message: responseData.message || 'Pago procesado',
      status: responseData.status === 'APPROVED' ? 'APROBADO' : 'RECHAZADO',
      data: responseData
    };
  } catch (error) {
    console.error('Error al comunicarse con la pasarela de pago:', error);
    return {
      success: false,
      message: 'Error en la comunicación con la pasarela de pago'
    };
  }
}