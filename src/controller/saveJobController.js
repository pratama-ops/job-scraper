const { pool } = require('../db/db');

const getSavedJobs = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM saved_jobs ORDER BY saved_at DESC'
        );
        res.json({ total: result.rows.length, jobs: result.rows });
    } catch (err) {
        console.error('❌ Error fetching saved jobs:', err.message);
        res.status(500).json({ error: 'Failed to fetch saved jobs' });
    }
};

const saveJob = async (req, res) => {
    const { id, source, title, company, url, tags, job_type } = req.body;

    if (!id || !source || !title || !company || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await pool.query(
            `INSERT INTO saved_jobs (id, source, title, company, url, tags, job_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
            [id, source, title, company, url, JSON.stringify(tags ?? []), job_type ?? 'full-time']
        );
        res.status(201).json({ message: 'Job saved successfully' });
    } catch (err) {
        console.error('❌ Error saving job:', err.message);
        res.status(500).json({ error: 'Failed to save job' });
    }
};

const deleteJob = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM saved_jobs WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ message: 'Job removed successfully' });
    } catch (err) {
        console.error('❌ Error deleting saved job:', err.message);
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

module.exports = { getSavedJobs, saveJob, deleteJob };