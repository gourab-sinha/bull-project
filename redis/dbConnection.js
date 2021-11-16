const redis = require('redis');
const opts = {
    redis: {
        opts: {
            createClient: function(type) {
                switch(type){
                    case 'client':
                        return client;
                    case 'subscriber':
                        return subscriber;
                    default:
                        return redis.createClient();
                }
            }
        }
    }
};

module.exports = {
    opts
};