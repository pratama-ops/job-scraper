const express = require('express');
const router = express.Router();
const { getJobs } = require('../controller/jobController');
const { getSavedJobs, saveJob, deleteJob } = require('../controller/saveJobController');

router.get('/jobs', getJobs);

router.get('/saved', getSavedJobs);
router.post('/saved', saveJob);
router.delete('/saved/:id', deleteJob);

module.exports = router;