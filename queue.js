const Queue = require('bull');

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create the submissions queue
const submissionQueue = new Queue('submissions', REDIS_URL, {
  redis: {
    // Additional Redis options for better reliability
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },
  defaultJobOptions: {
    // Default job options
    removeOnComplete: 10, // Keep only 10 completed jobs
    removeOnFail: 50,     // Keep 50 failed jobs for debugging
    attempts: 3,          // Retry failed jobs up to 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Event listeners for monitoring
submissionQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

submissionQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

submissionQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down queue gracefully...');
  await submissionQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down queue gracefully...');
  await submissionQueue.close();
  process.exit(0);
});

module.exports = submissionQueue;