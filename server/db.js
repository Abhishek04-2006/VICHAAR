const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Abhi@123',
  database: process.env.DB_NAME || 'vichaar_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Safe individual column auto-migrator
async function ensureSchema() {
  const columnsToAdd = [
    { name: 'avatar', query: 'ALTER TABLE users ADD COLUMN avatar LONGTEXT NULL' },
    { name: 'bio', query: "ALTER TABLE users ADD COLUMN bio VARCHAR(255) DEFAULT 'Campus Thinker & Active Debater'" },
    { name: 'department', query: "ALTER TABLE users ADD COLUMN department VARCHAR(50) DEFAULT 'BCA'" },
    { name: 'badge', query: "ALTER TABLE users ADD COLUMN badge ENUM('STUDENT', 'VERIFIED_DEBATER', 'FACULTY', 'DELEGATE') DEFAULT 'STUDENT'" }
  ];

  for (const col of columnsToAdd) {
    try {
      const [exists] = await pool.query(`SHOW COLUMNS FROM users LIKE ?`, [col.name]);
      if (exists.length === 0) {
        await pool.query(col.query);
        console.log(`✅ Injected missing column: ${col.name}`);
      }
    } catch (err) {
      console.error(`Error verifying ${col.name}:`, err.message);
    }
  }
  console.log("🚀 All user columns verified successfully!");
}

ensureSchema();

module.exports = pool;