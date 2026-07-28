const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });

    const [databases] = await connection.query('SHOW DATABASES;');
    console.log('Databases:', databases.map(d => Object.values(d)[0]).join(', '));

    if (databases.some(d => Object.values(d)[0] === 'elegantcut')) {
        const [rows] = await connection.query('SELECT * FROM elegantcut.usuarios;');
        console.log('Rows in elegantcut.usuarios:', rows.length);
    }

    if (databases.some(d => Object.values(d)[0] === 'elegant_cut')) {
        const [rows] = await connection.query('SELECT * FROM elegant_cut.usuarios;');
        console.log('Rows in elegant_cut.usuarios:', rows.length);
    }

    await connection.end();
}

main().catch(console.error);
