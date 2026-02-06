const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: true } // Bắt buộc cho TiDB
});

connection.connect(error => {
    if (error) console.error('❌ Lỗi kết nối DB:', error);
    else console.log('✅ Đã kết nối Cloud Database!');
});

module.exports = connection;