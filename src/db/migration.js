const { pool } = require('./db');

const runMigrations = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id          TEXT PRIMARY KEY,
        source      TEXT NOT NULL,
        title       TEXT NOT NULL,
        company     TEXT NOT NULL,
        url         TEXT NOT NULL,
        tags        TEXT DEFAULT '[]',
        job_type    TEXT,
        saved_at    TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Migrations berhasil');
  } catch (err) {
    console.error('❌ Migration gagal:', err);
  } finally {
    await pool.end();
  }
};

runMigrations();