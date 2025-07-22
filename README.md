# Backend de Ecommerce

Backend para un sistema de ecommerce con integración a pasarela de pagos.

## Configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. Configurar variables de entorno:
   Crear un archivo `.env` con las siguientes variables:
   ```
   DB_USER=neondb_owner
   DB_PASSWORD=npg_vZ65eFAqQEmH
   DB_HOST=ep-damp-shape-ae7wyjkq-pooler.c-2.us-east-2.aws.neon.tech
   DB_NAME=mydatabase
   DB_PORT=5432
   PORT=3000
   DATABASE_URL=postgresql://neondb_owner:npg_vZ65eFAqQEmH@ep-damp-shape-ae7wyjkq-pooler.c-2.us-east-2.aws.neon.tech/mydatabase?sslmode=require&channel_binding=require
   ```

3. Iniciar el servidor:
   ```
   npm start
   ```

## Endpoints

### POST /api/compra
Procesa una nueva compra y la registra en la base de datos.

**Payload:**
```json
{
  "cedula": "1234567890",
  "precio_total": 100.50,
  "bank": "Banco XYZ"
}
```

**Respuesta:**
```json
{
  "message": "Transacción procesada",
  "transaction": {
    "TransactionId": "uuid-generado",
    "Cedula": "1234567890",
    "Estado_trans": "APROBADO",
    "Precio_total": 100.50
  }
}
```

### GET /api/status/:transactionId
Consulta el estado de una transacción.

**Respuesta:**
```json
{
  "transaction": {
    "TransactionId": "uuid-generado",
    "Cedula": "1234567890",
    "Estado_trans": "APROBADO",
    "Precio_total": 100.50,
    "created_at": "2023-11-15T12:30:45.123Z"
  }
}
```

### GET /api/transacciones/:cedula
Consulta todas las transacciones de un usuario por su cédula.

**Respuesta:**
```json
{
  "transacciones": [
    {
      "TransactionId": "uuid-generado-1",
      "Cedula": "1234567890",
      "Estado_trans": "APROBADO",
      "Precio_total": 100.50,
      "created_at": "2023-11-15T12:30:45.123Z"
    },
    {
      "TransactionId": "uuid-generado-2",
      "Cedula": "1234567890",
      "Estado_trans": "RECHAZADO",
      "Precio_total": 1500.00,
      "created_at": "2023-11-14T10:15:30.456Z"
    }
  ]
}
```

### POST /pago
Endpoint de la pasarela de pago (para uso interno).

**Payload:**
```json
{
  "transactionId": "uuid-generado",
  "precio_total": 100.50,
  "cedula": "1234567890"
}
```

**Respuesta:**
```json
{
  "success": true,
  "status": "APROBADO",
  "message": "Pago procesado correctamente",
  "transactionId": "uuid-generado"
}
```

### POST /api/respuesta-pago
Endpoint para recibir la respuesta de la pasarela de pago.

**Payload:**
```json
{
  "transactionId": "uuid-generado",
  "status": "APROBADO"
}
```

**Respuesta (si es aprobada - código 200):**
```json
{
  "message": "Transacción aprobada",
  "transaction": {
    "TransactionId": "uuid-generado",
    "Cedula": "1234567890",
    "Estado_trans": "APROBADO",
    "Precio_total": 100.50,
    "created_at": "2023-11-15T12:30:45.123Z"
  }
}
```

**Respuesta (si es rechazada - código 418):**
```json
{
  "message": "Transacción rechazada",
  "transaction": {
    "TransactionId": "uuid-generado",
    "Cedula": "1234567890",
    "Estado_trans": "RECHAZADO",
    "Precio_total": 100.50,
    "created_at": "2023-11-15T12:30:45.123Z"
  }
}
```

## Despliegue en Render

Este proyecto está configurado para ser desplegado en Render. Asegúrate de configurar las variables de entorno en el dashboard de Render.