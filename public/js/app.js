// app.js
// Entry point for the frontend. Coordinates all modules —
// api.js, render.js, and storage.js — and handles user interactions
// like search and save/delete job actions.

// Handle search button click.
// Fetches jobs based on selected source, renders them
// into their respective columns, and updates job counts.
const handleSearch = async () => {
  const source = document.getElementById('sourceSelect').value;
  const keyword = document.getElementById('searchInput').value.trim();

  const containers = {
    remotive: 'remotiveList',
    arbeitnow: 'arbeitnowList',
    muse: 'museList',
  };

  // Show loading state on all columns
  Object.values(containers).forEach((id) => setLoading(id));

  const jobs = await getJobs(source, keyword);

  // Separate jobs by source
  const remotiveJobs = jobs.filter((job) => job.source === 'remotive');
  const arbeitnowJobs = jobs.filter((job) => job.source === 'arbeitnow');
  const museJobs = jobs.filter((job) => job.source === 'muse');

  // Render each column with saved state awareness
  renderJobs(remotiveJobs, 'remotiveList', savedIds);
  renderJobs(arbeitnowJobs, 'arbeitnowList', savedIds);
  renderJobs(museJobs, 'museList', savedIds);

  // Update job counts on each column header
  updateCount('remotiveCount', remotiveJobs.length);
  updateCount('arbeitnowCount', arbeitnowJobs.length);
  updateCount('museCount', museJobs.length);
};

// Handle save and delete actions using event delegation.
// Instead of attaching listeners to every card button,
// we listen on the document and check the clicked target.
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-save')) {
    const id = e.target.dataset.id;

    if (isJobSaved(id)) {
      // Job is already saved — delete it
      await handleDeleteJob(id);
    } else {
      // Job is not saved yet — save it
      const card = e.target.closest('.job-card');
      const job = {
        id,
        source: id.split('-')[0],
        title: card.querySelector('.job-title').textContent,
        company: card.querySelector('.job-company').textContent,
        url: card.querySelector('.btn-apply').href,
        tags: [...card.querySelectorAll('.tag')].map((t) => t.textContent),
        job_type: card.querySelector('.job-type').textContent,
      };
      await handleSaveJob(job);
    }
  }
});

// Allow search by pressing Enter key on the search input
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// Attach search button click listener
document.getElementById('searchBtn').addEventListener('click', handleSearch);

// On page load, fetch and render saved jobs immediately
// so the saved section is populated without needing a search.
document.addEventListener('DOMContentLoaded', () => {
  loadSavedJobs();
});