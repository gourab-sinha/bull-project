const { AbstractQueueClass } = require("./AbstractQueueClass");

class ConsumerQueueClass extends AbstractQueueClass {
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

    async getJobDetails(queueName, jobId) {
        return await this.queues[queueName].getJob(jobId);
    }
}

module.exports = {
    ConsumerQueueClass
};