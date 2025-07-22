-- Crear tabla de transacciones si no existe
CREATE TABLE IF NOT EXISTS transacciones (
    TransactionId VARCHAR(255) PRIMARY KEY,
    Cedula VARCHAR(255) NOT NULL,
    Estado_trans VARCHAR(50) NOT NULL,
    Precio_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);