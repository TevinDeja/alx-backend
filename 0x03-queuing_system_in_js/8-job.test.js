#!/usr/bin/yarn test
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  const BIG_SPY = sinon.spy(console);
  const QUEUE = createQueue({ name: 'push_notification_code_test' });

  before(() => {
    QUEUE.testMode.enter(true);
  });

  after(() => {
    QUEUE.testMode.clear();
    QUEUE.testMode.exit();
  });

  afterEach(() => {
    BIG_SPY.log.resetHistory();
  });

  it('checks and displays an error message if jobs is not an array', () => {
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, QUEUE)
    ).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', (done) => {
    expect(QUEUE.testMode.jobs.length).to.equal(0);
    const jobField = [
      {
        phoneNumber: '44336677889',
        message: 'Use the code 1962 to verify your account',
      },
      {
        phoneNumber: '98833665544',
        message: 'Use the code 1754 to verify your account',
      },
    ];
    createPushNotificationsJobs(jobField, QUEUE);
    expect(QUEUE.testMode.jobs.length).to.equal(2);
    expect(QUEUE.testMode.jobs[0].data).to.deep.equal(jobField[0]);
    expect(QUEUE.testMode.jobs[0].type).to.equal('push_notification_code_3');
    QUEUE.process('push_notification_code_3', () => {
      expect(
        BIG_SPY.log
          .calledWith('Notification job created:', QUEUE.testMode.jobs[0].id)
      ).to.be.true;
      done();
    });
  });

  it('does the registeration of the progress event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('progress', () => {
      expect(
        BIG_SPY.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, '25% complete')
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('progress', 25);
  });

  it('registers the failed event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('failed', () => {
      expect(
        BIG_SPY.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'failed:', 'Failed to send')
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  it('does the registeration of the complete event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('complete', () => {
      expect(
        BIG_SPY.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'completed')
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('complete');
  });
});
