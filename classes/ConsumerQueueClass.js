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
        const job = await this.queues[queueName].getJob(jobId);
        console.log(job);
        if (!job) {
            return {};
        }

        const data = {
            ...job.returnvalue
        };
        await this.queues[queueName].removeJobs([jobId]);
        return data;
    }
}

module.exports = {
    ConsumerQueueClass
};