const { createBullBoard } = require('bull-board');
const { BullAdapter } = require('bull-board/bullAdapter');
const { connectQueue, handlerFailure, handlerComplete, handlerStalled } = require('../services/service');
const { ConsumerQueueClass } = require('../classes/ConsumerQueueClass');
const Bull = require('bull');
const nameQueue = 'demo';
const nodemailer = require('nodemailer');
const { opts } = require('../redis/dbConnection');
const consumerQueue = connectQueue(nameQueue);
const { router } = createBullBoard([
    new BullAdapter(consumerQueue)
]);

const consumerQueueClass = new ConsumerQueueClass(Bull);
consumerQueueClass.createQueue(nameQueue, '', opts, 1, processJob, 'consumer');

// const consumerQueueClass2 = new ConsumerQueueClass(Bull);

async function processJob(job) {
    
    console.log(`Attempt Number ${job.attemptsMade}`);
    if (job.attemptsMade < 2) {
        throw new Error('Server is down');
    }
    
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false 
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail(job.data);

    console.log("Message sent: %s", info.messageId);
    return {...job.data};
    
}

async function getEmailsFromQueue(jobId) {
    return await consumerQueueClass.getJobDetails(nameQueue, jobId);
}



module.exports = {
    getEmailsFromQueue,
    bullBoardRoute: router,
    processJob
}
