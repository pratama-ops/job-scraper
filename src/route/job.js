const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/jobsController');
const { getSavedJobs, saveJob, deleteJob } = require('../controllers/savedController');

router.get('/jobs', getJobs);

router.get('/saved', getSavedJobs);
router.post('/saved', saveJob);
router.delete('/saved/:id', deleteJob);

module.exports = router;