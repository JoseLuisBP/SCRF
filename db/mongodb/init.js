
db = db.getSiblingDB('app_mongo');

// Colección: Logs de la aplicación
db.createCollection('app_logs', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['timestamp', 'level', 'message'],
            properties: {
                timestamp: {
                    bsonType: 'date',
                    description: 'Fecha y hora del log'
                },
                level: {
                    enum: ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
                    description: 'Nivel de severidad del log'
                },
                message: {
                    bsonType: 'string',
                    description: 'Mensaje del log'
                },
                metadata: {
                    bsonType: 'object',
                    description: 'Información adicional del log'
                }
            }
        }
    }
});
