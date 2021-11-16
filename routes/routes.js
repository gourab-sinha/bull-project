const { getEmails } = require("../api/consumer");
const { sendEmail } = require("../api/producer");
const { bullBoardRoute } = require("../consumer/consumer");

function loadRoutes(app) {
    app.use('/admin/queues', bullBoardRoute);
    app.get('/get-emails', getEmails);
    app.post('/send-email', sendEmail);
}

module.exports = {
    loadRoutes
};