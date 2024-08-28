#!/usr/bin/yarn dev
import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Create sendNotification function
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

console.log('Job processor is running...');
