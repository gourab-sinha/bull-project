const { jobs } = require("../producer/producer");

async function sendEmail(req, res, next) {
    const { jobType, ...restBody } = req.body;
    console.log('Send Email');
    await jobs(jobType, restBody);
    res.send({
        status: 'OK',
        // data,
        messsage: 'Successfully sent the data'
    });
}

module.exports = {
    sendEmail
}