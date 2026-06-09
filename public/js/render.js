const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const renderJobCard = (job, isSaved = false) => {
    const tags = Array.isArray(job.tags)
        ? job.tags
        : JSON.parse(job.tags || '[]');

    const card = document.createElement('div');
    card.classList.add('job-card');
    card.dataset.id = job.id;

    card.innerHTML = `
    <p class="job-title">${job.title}</p>
    <p class="job-company">${job.company}</p>
    <div class="job-tags">
      ${tags.slice(0, 4).map((tag) => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="job-meta">
      <span class="job-type">${job.job_type ?? 'full-time'}</span>
      <span class="job-date">${formatDate(job.posted_at)}</span>
    </div>
    <div class="card-actions">
      <a class="btn-apply" href="${job.url}" target="_blank">Apply</a>
      <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${job.id}">
        ${isSaved ? '⭐ Saved' : '☆ Save'}
      </button>
    </div>
  `;

    return card;
};

const renderJobs = (jobs, containerId, savedIds = []) => {
    const container = document.getElementById(containerId);

    if (!jobs.length) {
        container.innerHTML = `<p class="empty-state">No jobs found</p>`;
        return;
    }

    container.innerHTML = '';
    jobs.forEach((job) => {
        const isSaved = savedIds.includes(job.id);
        container.appendChild(renderJobCard(job, isSaved));
    });
};

const renderSavedJobs = (jobs) => {
    const container = document.getElementById('savedList');

    if (!jobs.length) {
        container.innerHTML = `<p class="empty-state">No saved jobs yet</p>`;
        return;
    }

    container.innerHTML = '';
    jobs.forEach((job) => {
        container.appendChild(renderJobCard(job, true));
    });
};

const updateCount = (elementId, count) => {
    document.getElementById(elementId).textContent = `${count} jobs`;
};

const setLoading = (containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = `<p class="loading">fetching jobs...</p>`;
};