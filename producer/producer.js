const { connectQueue } = require("../services/service");
const nodemailer = require('nodemailer');

const jobOptions = {
    // removeOnComplete: true,
    attempts: 3,
    // backOff: {}
};

async function processJob(job) {
    try {
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

const nameQueue = 'demo';
const producerQueue = connectQueue(nameQueue);
producerQueue.process(processJob);


async function jobs(jobType, data) {
    await producerQueue.add(data,{
        ...jobOptions,
        backOff: 3
    });
}


module.exports = {
    jobs
};
