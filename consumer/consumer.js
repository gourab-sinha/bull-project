const { createBullBoard } = require('bull-board');
const { BullAdapter } = require('bull-board/bullAdapter');
const { connectQueue, handlerFailure, handlerComplete, handlerStalled } = require('../services/service');
const nameQueue = 'demo';
const nodemailer = require('nodemailer');
const consumerQueue = connectQueue(nameQueue);
const { router } = createBullBoard([
    new BullAdapter(consumerQueue)
]);

async function processJob(job) {
    try {
        console.log(`Attempt Number ${job.attemptsMade}`);
        if (job.attemptsMade < 2) {
            console.log(`Attempt Number ${job.attemptsMade}`);
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
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // console.log(job.data);
        return nodemailer.getTestMessageUrl(info);

    } catch (error) {
        console.log(error);
    }
}

async function getEmailsFromQueue(jobType) {
    consumerQueue.process(processJob);
    const job = await consumerQueue.getNextJob();
    const currentJob = await job.moveToFailed({
        message: 'Call to external service failed!',
        }, true
    );
    const nextJob = await job.moveToCompleted('succeeded', true);
    if (nextJob) {
        return await job.toJSON();
    }
    return null;
}



module.exports = {
    getEmailsFromQueue,
    bullBoardRoute: router
}
