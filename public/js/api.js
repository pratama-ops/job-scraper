const BASE_URL = 'http://localhost:3000/api';

const getJobs = async (source = 'all', keyword = '') => {
    try {
        const response = await fetch(`${BASE_URL}/jobs?source=${source}&keyword=${encodeURIComponent(keyword)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();
        return data.jobs;
    } catch (err) {
        console.error('❌ Error fetching jobs:', err.message);
        return [];
    }
};

const getSavedJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/saved`);

        if (!response.ok) {
            throw new Error(`Failed to fetch saved jobs: ${response.status}`);
        }

        const data = await response.json();
        return data.jobs;
    } catch (err) {
        console.error('❌ Error fetching saved jobs:', err.message);
        return [];
    }
};

const saveJob = async (job) => {
    try {
        const response = await fetch(`${BASE_URL}/saved`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job),
        });

        if (!response.ok) {
            throw new Error(`Failed to save job: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('❌ Error saving job:', err.message);
    }
};

const deleteJob = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/saved/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete job: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('❌ Error deleting job:', err.message);
    }
};