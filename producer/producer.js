const { connectQueue } = require("../services/service");
const nodemailer = require('nodemailer');

const jobOptions = {
    // removeOnComplete: true,
    attempts: 3,
    // backOff: {}
};

const nameQueue = 'demo';
const producerQueue = connectQueue(nameQueue);


async function jobs(jobType, data) {
    await producerQueue.add(data,{
        ...jobOptions,
        backOff: 3
    });
}


module.exports = {
    jobs
};
