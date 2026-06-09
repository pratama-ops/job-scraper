const express = require('express');
const path = require('path');
require('dotenv').config();

const jobsRoute = require('./route/job');
const { connectDB } = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', jobsRoute);

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();