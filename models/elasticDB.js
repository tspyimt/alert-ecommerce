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
var insertDB = function(data, callback){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(data);
        }else{
            query = data;
        }
        clientElastic.index(query, function(err){
            if(err){
                console.log('Insert Elastic Error: '+ JSON.stringify(query));
                return callback(false);
            }else{
                console.log('Insert Elastic successfully');
                return callback(true);
            }
        });
    }catch(ex){
        console.log('Insert Elastic Error: '+ JSON.stringify(data));
        return callback(false);
    }
}
/**
 * Delete object by ID to database.
 *
 * @method deleteDB
 * @param {Object} syntax to delete object by Id to DB
 * @return {Boolean} Returns true on success
 */
var deleteDB = function(data, callback){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(data);
        }else{
            query = data;
        }
        clientElastic.delete(query, function(err){
            if(err){
                console.log('Delete Elastic Error: '+ JSON.stringify(query));
                return callback(false);
            }else{
                console.log('Delete Elastic successfully');
                return callback(true);
            }
        });
    }catch(ex){
        console.log('Delete Elastic Error: '+ JSON.stringify(data));
        return callback(false);
    }
}
/**
 * Search object
 *
 * @method searchDB
 * @param {Object} syntax to search
 * @return {Object} Returns result for search
 */
var searchDB = function(data, callback){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(data);
        }else{
            query = data;
        }
        clientElastic.search(query, function(err, data){
            if(err){
                console.log('Search Elastic Error: '+ JSON.stringify(query));
                return callback(false);
            }else{
                console.log('Search Elastic successfully');
                return callback(data);
            }
        });
    }catch(ex){
        console.log('Search Elastic Error: '+ JSON.stringify(data));
        return callback(false);
    }
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
var createSchedule = function(userId, tags, callback){
    if(userId && tags){
        client.index({
            index: 'schedule',
            body: {
                userId: userId,
                tags: tags
            }
        }, function(err){
            if(err){
                console.log(err);
                return callback(false);
            }else{
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
var sendNotiWhenNewNode = function(node, callback){
    if(node && node.content){
        clientElastic.search({
            index: 'schedule',
            body: {

            }
        });
    }else{
        console.log('Missing params');
        return callback(false);
    }
}
module.exports = {
    insertDB : insertDB,
    deleteDB : deleteDB,
    searchDB : searchDB,
    getScheduleById: getScheduleById,
    createSchedule: createSchedule,
    deleteSchedule: deleteSchedule
}