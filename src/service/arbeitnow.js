const ARBEITNOW_URL = 'https://www.arbeitnow.com/api/job-board-api';

const fetchArbeitnowJobs = async () => {
  try {
    const response = await fetch(ARBEITNOW_URL);

    if (!response.ok) {
      throw new Error(`Arbeitnow API error: ${response.status}`);
    }

    const data = await response.json();

    const jobs = data.data
      .filter((job) => {
        const location = job.location?.toLowerCase() ?? '';
        const isUS =
          location.includes('united states') ||
          location.includes('usa') ||
          location.includes('remote');

        const isRemote = job.remote === true;

        const isPartTime = job.job_types?.some((type) =>
          type.toLowerCase().includes('part')
        );

        return isUS || isRemote || isPartTime;
      })

      //formatting 
      .map((job) => ({
        id: `arbeitnow-${job.slug}`,
        source: 'arbeitnow',
        title: job.title,
        company: job.company_name,
        url: job.url,
        tags: job.tags ?? [],
        job_type: job.job_types?.[0] ?? 'full-time',
        location: job.location,
        remote: job.remote,
        posted_at: new Date(job.created_at * 1000).toISOString(),
      }));

    return jobs;
  } catch (err) {
    console.error('❌ Gagal fetch Arbeitnow:', err.message);
    return [];
  }
};

module.exports = { fetchArbeitnowJobs };