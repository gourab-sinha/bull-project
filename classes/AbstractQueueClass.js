class AbstractQueueClass {
    queues = {};
    bull = null;
    constructor() {
        if (this.constructor === AbstractQueueClass) {
            throw new Error('Cannot instantiated abstract class');
        }
    }

    /**
     * 
     * @param {String} queueName 
     * @param {String} jobType 
     * @param {*} options 
     * @param {Number} concurrency 
     * @param {Function} processor 
     * @param {String} queueType
     */
     async createQueue(queueName, jobType = '', opts = {}, concurrency = 1, processor, queueType = 'producer') {
        if (!this.isQueuePresent(queueName)) {
            const newQueue = this.bull(queueName, opts);
            this.queues[queueName] = newQueue;
        }

        if (queueType === 'producer') {
            if (jobType != '') {
                this.queues[queueName].process(jobType, concurrency, processor);
            } else {
                this.queues[queueName].process(concurrency, processor);
            }
            this.queues[queueName].on('failed', this.handlerFailure);
            this.queues[queueName].on('completed', this.handlerComplete);
            this.queues[queueName].on('stalled', this.handlerStalled);
        }
    }

    /**
     * 
     * @param {*} queueName 
     */
    isQueuePresent(queueName) {
        return this.queues.hasOwnProperty(queueName);
    }

    /**
     * 
     * @returns 
     */
    getAllQueue() {
        return this.queues;
    }
    /**
     * 
     * @param {*} job 
     */
    async handlerComplete(job) {
        console.info(
            `Job in ${job.queue.name} completed for: ${job.data.message}`
        )
        // job.remove();
    }

    /**
     * 
     * @param {*} job 
     * @param {*} done 
     */

    async handlerFailure(job, done) {
        if (job.attemptsMade >= job.opts.attempts) {
            console.info(
                `Job failures above threshold in ${job.queue.name} for: ${job.id}`,
            )
            return null;
        }
        console.info(
            `Job in ${job.queue.name} failed for: ${job.id} with ${job.opts.attempts - job.attemptsMade} attempts left`
        );

    }
    /**
     * 
     * @param {*} job 
     */
    async handlerStalled(job) {
        console.info(
            `Job in ${job.queue.name} stalled for: ${job.id}`
        );
    }
}


module.exports = {
    AbstractQueueClass
};