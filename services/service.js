const Bull = require('bull');
const { opts } = require('../redis/dbConnection');
const connectQueue = (name) => new Bull(name, opts);

async function handlerComplete(job) {
    console.log(job.queue.name, job.data.message);
    job.remove();
}

async function handlerFailure(job, error) {
    if (job.attemptsMade >= job.opts.attempts) {
        console.log(`Job failures above threshold in ${job.queue.name} for ${job.id}`);
        return null;
    }
    console.log(`Job attempts left in ${job.queue.name} for ${job.id}`);
}

async function handlerStalled(job) {
    console.log(`Job in ${job.queue.name} stalled for :${job.id}`);
}

module.exports = {
    connectQueue,
    handlerComplete,
    handlerFailure,
    handlerStalled
};