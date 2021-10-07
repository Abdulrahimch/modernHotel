const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient();
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(){
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache){
        return exec.apply(this, arguments);
    }
    console.log('i am about to run a query to cache server');
    const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }));
    console.log(key)
    // look up the key in redis, if it exists, send respond right away
    const cacheValue = await client.get(key);
    if (cacheValue){
        console.log('this is a cached value');
        const doc = JSON.parse(cacheValue);
        // Note: JSON.parse return Json obj. But for mongoose to be able to work with it,
        // we need to model it by invoking model function as follow: new this.model.
        // moreover, we have to know that this.model takes an object as an argument not an array.
        // so to sole this we will reconstruct it as below:
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);

    }
    // if the key does not exist, then send off the query to mongodb

    // send respond to client, and cache the key and its value


    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    return result
};

module.exports = {
    clearCache(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}