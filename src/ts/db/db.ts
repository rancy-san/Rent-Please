const redis = require('redis');
class Database {
    private client:any;

    constructor() {  
        this.client = redis.createClient({
            port: 9001,
            host: 'localhost',
            password: ''
        });
    }
}