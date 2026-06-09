const { fetchRemotiveJobs } = require('../services/remotive');
const { fetchArbeitnowJobs } = require('../services/arbeitnow');
const { fetchMuseJobs } = require('../services/the-muse');

const getJobs = async (req, res) => {
    const { source = 'all' } = req.query;

    try {
        // Initialize empty array as a container for job results.
        // This will be populated based on the 'source' query parameter
        // (e.g. 'remotive', 'arbeitnow', 'muse', or 'all' for combined results).
        let jobs = [];

        if (source === 'remotive') {
            jobs = await fetchRemotiveJobs();
        } else if (source === 'arbeitnow') {
            jobs = await fetchArbeitnowJobs();
        } else if (source === 'muse') {
            jobs = await fetchMuseJobs();
        } else if (source === 'all') {
            const [remotive, arbeitnow, muse] = await Promise.all([
                fetchRemotiveJobs(),
                fetchArbeitnowJobs(),
                fetchMuseJobs(),
            ]);
            jobs = [...remotive, ...arbeitnow, ...muse];
        } else {
            return res.status(400).json({ error: 'Invalid source parameter' });
        }

        res.json({ source, total: jobs.length, jobs });
    } catch (err) {
        console.error('❌ Error fetching jobs:', err.message);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

module.exports = { getJobs };