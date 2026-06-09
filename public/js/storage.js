// storage.js
// Handles all saved jobs state in the browser.
// Acts as a local cache of saved job IDs so render.js
// can instantly know which jobs are already saved
// without hitting the backend every time.

let savedIds = [];

// Fetch all saved jobs from the backend and update
// the local savedIds cache. Called on page load and
// after every save/delete action.
const loadSavedJobs = async () => {
  const jobs = await getSavedJobs();
  savedIds = jobs.map((job) => job.id);
  renderSavedJobs(jobs);
  document.getElementById('savedCount').textContent = `${jobs.length} saved`;
  return savedIds;
};

// Save a job to the backend and update local cache.
// Also updates the save button appearance on the card.
const handleSaveJob = async (job) => {
  await saveJob(job);
  savedIds.push(job.id);

  const btn = document.querySelector(`.btn-save[data-id="${job.id}"]`);
  if (btn) {
    btn.textContent = '⭐ Saved';
    btn.classList.add('saved');
  }

  await loadSavedJobs();
};

// Remove a job from the backend and update local cache.
// Also resets the save button appearance on the card.
const handleDeleteJob = async (id) => {
  await deleteJob(id);
  savedIds = savedIds.filter((savedId) => savedId !== id);

  const btn = document.querySelector(`.btn-save[data-id="${id}"]`);
  if (btn) {
    btn.textContent = '☆ Save';
    btn.classList.remove('saved');
  }

  await loadSavedJobs();
};

// Check if a job is already saved by looking up
// the local savedIds cache — avoids unnecessary API calls.
const isJobSaved = (id) => savedIds.includes(id);