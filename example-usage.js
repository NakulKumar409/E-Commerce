const submissionQueue = require('./queue');

// Example: Adding a job to the queue
async function addSubmissionJob(submissionData) {
  try {
    const job = await submissionQueue.add('process-submission', submissionData, {
      // Job-specific options (override defaults if needed)
      priority: 1, // Higher priority = processed first
      delay: 0,    // No delay
    });
    
    console.log(`Added job ${job.id} to the queue`);
    return job;
  } catch (error) {
    console.error('Failed to add job to queue:', error);
    throw error;
  }
}

// Example: Processing jobs (worker)
submissionQueue.process('process-submission', async (job) => {
  const { data } = job;
  
  try {
    // Simulate processing work
    console.log(`Processing submission ${data.id}...`);
    
    // Update progress
    await job.progress(25);
    
    // Simulate some async work
    await new Promise(resolve => setTimeout(resolve, 1000));
    await job.progress(50);
    
    // More work...
    await new Promise(resolve => setTimeout(resolve, 1000));
    await job.progress(75);
    
    // Final processing
    await new Promise(resolve => setTimeout(resolve, 500));
    await job.progress(100);
    
    // Return result
    return {
      success: true,
      submissionId: data.id,
      processedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error processing submission ${data.id}:`, error);
    throw error;
  }
});

// Example usage
if (require.main === module) {
  // Add a test job
  addSubmissionJob({
    id: 'sub-001',
    content: 'Test submission',
    userId: 'user123',
  });
}

module.exports = {
  addSubmissionJob,
};