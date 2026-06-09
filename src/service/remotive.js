const REMOTIVE_URL = 'https://remotive.com/api/remote-jobs';

async function fetchRemotiveJob() {
    try {
        const response = await fetch(`${REMOTIVE_URL}?category=software-dev&search=backend`);

        if (!response.ok) {
            throw new Error(`Remotive API error: ${response.status}`);
        };

        const data = await response.json();

        //transform ke format yang rapi untuk dikirim ke frontend
        const jobs = data.jobs.map((job) => ({
            id: `remotive-${job.id}`,
            source: 'remotive',
            title: job.title,
            company: job.company_name,
            url: job.url,
            tags: job.tags ?? [],
            job_type: job.job_type ?? 'full-time',
            posted_at: job.publication_date,
        }));

        //tambahkan filter hanya us + part time/remote saja
        const filtered = jobs.filter((job) => {
            const isUS =
                job.company_location?.toLowerCase().includes('usa') ||
                job.company_location?.toLowerCase().includes('united states') ||
                job.company_location?.toLowerCase().includes('us');

            const isPartTime = job.job_type?.toLowerCase().includes('part');
            const isRemote = job.job_type?.toLowerCase().includes('remote');

            return isPartTime || isRemote;
        });

        return filtered;
    } catch (err) {
        console.error('Gagal fetch remotive: ', err.message);
        return[];
    }
};

module.exports = { fetchRemotiveJob };