const { getEmailsFromQueue } = require('../consumer/consumer');
async function getEmails(req, res, next) {
    debugger;
    const { jobType } = req.query;
    const data = await getEmailsFromQueue(jobType);
    res.send({
        status: 'OK', 
        data,
        message: 'Successfully fetched'
    });
}

module.exports = {
    getEmails
}