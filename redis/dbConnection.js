const redis = require('redis');
const client = redis.createClient();
const subscriber = redis.createClient();
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