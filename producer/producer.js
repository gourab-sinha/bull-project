const { processJob } = require("../consumer/consumer");
const { ProducerQueueClass } = require('../classes/ProducerQueueClass');
const Bull = require('bull');
const { opts } = require("../redis/dbConnection");
const producerQueueClass = new ProducerQueueClass(Bull);
const nameQueue = 'demo';
producerQueueClass.createQueue(nameQueue, '', opts, 1, 'producer');

const jobOptions = {
    attempts: 3,
};


async function jobs(data, jobType = '',) {
    return await producerQueueClass.addJobToQueue(nameQueue, jobOptions, jobType, data);
}


module.exports = {
    jobs
};
