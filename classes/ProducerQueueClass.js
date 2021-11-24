const { AbstractQueueClass } = require("./AbstractQueueClass");

class ProducerQueueClass extends AbstractQueueClass {
    constructor(bull) {
        super();
        if (Object.getPrototypeOf(this).isInstantiated) {
            throw new Error(`Cannot create more than one instance of ${this.constructor.name}`);
        }

        Object.defineProperty(Object.getPrototypeOf(this), 'isInstantiated', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });

        this.queues = {};
        this.bull = bull;
    }

    async addJobToQueue(queueName, jobOptions, jobType = '', data) {
        if (jobType != '') {
            return await this.queues[queueName].add(jobType, data, jobOptions);
        }

        return await this.queues[queueName].add(data, jobOptions);
    }
}

module.exports = {
    ProducerQueueClass
}