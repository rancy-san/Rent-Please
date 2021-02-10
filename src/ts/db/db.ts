const redis = require('redis');
class Database {
    private client:any;

    constructor() {  
        this.client = redis.createClient({
            port: '6379', // default
            host: '127.0.0.1'
        });
    }

    public async rpushQueueData(queueName, queueData) {
        console.log("* Redis RPUSH ...");
        try {
            await this.client.rpush(queueName, queueData);
            console.log("+ Redis RPUSH Success.");
        } catch (e) {
            console.log("- Redis RPUSH Failed.");
        }
    }


    public async lremQueueData(queueName, queueData) {
        console.log("* Redis LREM ...");
        try {
            await this.client.lrem(queueName, 1, queueData);
            console.log("+ Redis LREM Success.");
        } catch (e) {
            console.log("- Redis LREM Failed.");
        }
    }
}

module.exports = Database;