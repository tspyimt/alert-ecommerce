var async = require('async');
var elasticsearch = require('elasticsearch');
var clientElastic = new elasticsearch.Client({
//host: 'localhost:9200',
    host: 'https://Ihkl5henvkmLs3GUuzE6wgHb2i0Sm0C0:@ga.east-us.azr.facetflow.io'
});
// Setting filter for table
var settings = {
    "analysis": {
        "analyzer": {
            "nGram_analyzer": {
                "alias": "default_index",
                "tokenizer": "nGram_tokenizer",
                "filter": [
                    "lowercase",
                    "asciifolding"
                ]
            }
        },
        "tokenizer": {
            "nGram_tokenizer": {
                "type": "nGram",
                "min_gram": 2,
                "max_gram": 25
            }
        }
    }
};
// Add setting to table
clientElastic.indices.create({
    index: 'nodes',
    body: {
        settings: settings,
        "_all" : {"enabled" : true}
    }
}, function(err){
    if(err) console.log(err);
    console.log('Settings nodes finished');
});
clientElastic.indices.create({
    index: 'schedule',
    body: {
        settings: settings
    }
}, function(err){
    if(err) console.log(err);
    console.log('Settings schedule finished');
});
clientElastic.indices.create({
    index: 'notification',
    body: {
        settings: settings
    }
}, function(err){
    if(err) console.log(err);
    console.log('Settings notification finished');
});

/**
 * Insert object to database.
 * If input have id which is exits, this'll update object to DB
 *
 * @method insertDB
 * @param {Object} syntax to insert object to DB
 * @return {Boolean} Returns true on success
 */
var insertDB = function(query, callback){
    clientElastic.index(query, function(err, response){
        if(err){
            console.log('Insert Elastic Error: '+ JSON.stringify(query));
            return callback(false);
        }else{
            console.log('Insert Elastic successfully');
            if(response._index === 'nodes'){
                sendNotiWhenNewNode(response._id, function(){});
            }
            console.log(response);
            return callback(true);
        }
    });
}

/**
 * Delete object by ID to database.
 *
 * @method deleteDB
 * @param {Object} syntax to delete object by Id to DB
 * @return {Boolean} Returns true on success
 */
var deleteDB = function(query, callback){
    clientElastic.delete(query, function(err){
        if(err){
            console.log('Delete Elastic Error: '+ JSON.stringify(query));
            return callback(false);
        }else{
            console.log('Delete Elastic successfully');
            return callback(true);
        }
    });
}

/**
 * Search object
 *
 * @method searchDB
 * @param {Object} syntax to search
 * @return {Object} Returns result for search
 */
var searchDB = function(query, callback){
    clientElastic.search(query, function(err, data){
        if(err){
            console.log('Search Elastic Error: '+ JSON.stringify(query));
            return callback(false);
        }else{
            console.log('Search Elastic successfully');
            return callback(data);
        }
    });
}

/**
 * Get schedule by Id
 *
 * @method searchDB
 * @param {String} Id of object
 * @return {Object} Returns schedule
 */
var getScheduleById = function(id, callback){
    if(id){
        clientElastic.search({
            index: 'schedule',
            id: id
        }, function(err, result){
            if(err){
                console.log('getScheduleById: Error id-'+id);
                return callback(false);
            }else{
                return callback(result);
            }
        })
    }else{
        console.log('getScheduleById: Missing id');
        return callback(false);
    }
}

/**
 * Create schedule to DB
 *
 * @method searchDB
 * @param {String} Id of object
 * @return {Boolean} Returns true for success
 */
var createSchedule = function(info, callback){
    if(info.userId && info.tags && info.type){
        clientElastic.index({
            index: 'schedule',
            type: 'schedule',
            body: {
                userId: info.userId,
                tags: info.tags,
                type: info.type,
                time: info.time
            }
        }, function(err){
            if(err){
                console.log(err);
                return callback(false);
            }else{
                if(info.type === "Reservation"){

                }
                return callback(true);
            }
        });
    }else{
        console.log('createSchedule: Missing params');
        return callback(false);
    }
}

/**
 * Create schedule to DB
 *
 * @method searchDB
 * @param {String} Id of object
 * @return {Boolean} Returns true for success
 */
var deleteSchedule = function(scheduleId, callback){
    if(scheduleId){
        clientElastic.delete({
            index: 'schedule',
            id: scheduleId
        }, function(err){
            if(err){
                console.log('deleteSchedule: Error');
                console.log(err);
                return callback(false);
            }else{
                return callback(true);
            }
        })
    }else{
        console.log('deleteSchedule: Missing params');
        return callback(false);
    }
}

/**
 * Send notification when new node
 *
 * @method sendNotiWhenNewNode
 * @param {object} Node, which have created
 * @return {Array} Returns array user send notification
 */
var sendNotiWhenNewNode = function(nodeId, callback){
    clientElastic.search({
        index: 'nodes',
        id: nodeId
    }, function(err, result){
        if(err){
            console.log(err);
            return callback(false);
        }else{
            if(result.hits.hits && result.hits.hits[0]){
                var node = result.hits.hits[0];
                clientElastic.search({
                    index: 'schedule',
                    type: 'schedule',
                    body: {
                        query: {
                            "bool": {
                                "must": [
                                    { "match": { "tags": node._source.content }},
                                    { "match": { "type": 'ASAP'}}
                                ]
                            }
                        }
                    }
                }, function(err, result){
                    if(err){
                        console.log('sendNotiWhenNewNode: '+JSON.stringify(node));
                        console.log(err);
                        return callback(false);
                    }else{
                        if(result.hits.hits.length > 0){
                            console.log(result.hits.hits);
                            async.forEachLimit(result.hits.hits, 50, function(hit, cb){
                                insertDB({
                                    index: 'notification',
                                    type: 'notification',
                                    body: {
                                        userId: hit._source.userId,
                                        nodes: node._source,
                                        date: new Date()
                                    }
                                }, function(status){
                                    cb();
                                });
                            }, function(){
                                return callback(true);
                            });
                        }else{
                            console.log('sendNotiWhenNewNode: no result');
                            return callback(false);
                        }
                    }
                });
            }else{
                return callback(false);
            }
        }
    });
}

/**
 * Create cronjob to create notification for userId
 *
 * @method createCronJobToUpdateNoti
 * @param {Date} Time to create cronjob
 * @param {String} Id id schedule
 * @return {Boolean} Return success or not
 */
function createCronJobToUpdateNoti(scheduleId, callback){
    if(scheduleId){
        clientElastic.search({
            index: 'schedule',
            id: scheduleId
        }, function(err, result){
            if(err){
                console.log(err);
                return callback(false);
            }else{
                if(result.hits.hits && result.hits.hits[0]){
                    var schedule = result.hits.hits[0];
                    clientElastic.search({
                        index: "nodes",
                        body: {
                            query: {
                                "bool": {
                                    "must": [
                                        { "match": { "content": schedule.tags }}
                                    ]
                                }
                            },
                            "highlight" : {
                                "fields" : {
                                    "content" : {}
                                }
                            }
                        }
                    }, function(err, result){
                        if(err){
                            console.log(err);
                            return callback(false);
                        }else{
                            if(result.hits.hits.length > 0){
                                var listNode = [];
                                async.forEachLimit(result.hits.hits, 50, function(hit, cb){
                                    listNode.push(hit._source);
                                    cb();
                                }, function(){
                                    insertDB({
                                        index: 'notification',
                                        type: 'notification',
                                        body: {
                                            userId: schedule._source.userId,
                                            nodes: listNode,
                                            date: new Date()
                                        }
                                    }, function(status){
                                        return callback(status);
                                    });
                                });
                            }else{
                                return callback(false);
                            }
                        }
                    });
                }else{
                    return callback(false);
                }
            }
        });
    }else{
        console.log('createCronJobToUpdateNoti: Missing param');
        return callback(false);
    }
}
module.exports = {
    insertDB : insertDB,
    deleteDB : deleteDB,
    searchDB : searchDB,
    getScheduleById: getScheduleById,
    createSchedule: createSchedule,
    deleteSchedule: deleteSchedule,
    sendNotiWhenNewNode: sendNotiWhenNewNode
}