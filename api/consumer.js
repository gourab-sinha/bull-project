const { getEmailsFromQueue } = require('../consumer/consumer');
async function getEmails(req, res, next) {
    debugger;
    const { jobId } = req.query;
    const data = await getEmailsFromQueue(jobId);
    res.send({
        status: 'OK', 
        data,
        message: 'Successfully fetched'
    });
}

module.exports = {
    getEmails
}