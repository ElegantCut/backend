import * as mysql from 'mysql2/promise';

export const databaseProviders = [
    {
        provide: 'DATABASE_POOL',
        useFactory: async () => {
            const pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'elegantcut',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            });

            try {
                const connection = await pool.getConnection();
                console.log('✅ Conexión a MySQL exitosa');
                connection.release();
            } catch (err) {
                console.error('❌ Error de conexión a MySQL:', err.message);
            }

            return pool;
        },
    },
];
