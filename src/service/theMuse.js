const MUSE_URL = 'https://www.themuse.com/api/public/jobs';

const fetchMuseJobs = async () => {
  try {
    const response = await fetch(
      `${MUSE_URL}?category=Software%20Engineering&location=United%20States&page=1`
    );

    if (!response.ok) {
      throw new Error(`The Muse API error: ${response.status}`);
    }

    const data = await response.json();

    const jobs = data.results
      .filter((job) => {
        const location = job.locations?.[0]?.name?.toLowerCase() ?? '';
        const isRemote =
          location.includes('remote') ||
          location.includes('flexible');
        const isUS =
          location.includes('united states') ||
          location.includes('flexible / remote') ||
          isRemote;

        return isUS || isRemote;
      })
      .map((job) => ({
        id: `muse-${job.id}`,
        source: 'muse',
        title: job.name,
        company: job.company.name,
        url: job.refs.landing_page,
        tags: job.categories?.map((c) => c.name) ?? [],
        job_type: job.levels?.[0]?.name ?? 'full-time',
        location: job.locations?.[0]?.name ?? '',
        remote: job.locations?.[0]?.name?.toLowerCase().includes('remote') ?? false,
        posted_at: job.publication_date,
      }));

    return jobs;
  } catch (err) {
    console.error('❌ Gagal fetch The Muse:', err.message);
    return [];
  }
};

module.exports = { fetchMuseJobs };