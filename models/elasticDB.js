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
        settings: settings
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
                callback(false);
            }else{
                console.log('Insert Elastic successfully');
                callback(true);
            }
        });
    }catch(ex){
        console.log('Insert Elastic Error: '+ JSON.stringify(data));
        callback(false);
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
                callback(false);
            }else{
                console.log('Delete Elastic successfully');
                callback(true);
            }
        });
    }catch(ex){
        console.log('Delete Elastic Error: '+ JSON.stringify(data));
        callback(false);
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
                callback(false);
            }else{
                console.log('Search Elastic successfully');
                callback(data);
            }
        });
    }catch(ex){
        console.log('Search Elastic Error: '+ JSON.stringify(data));
        callback(false);
    }
}
module.exports = {
    insertDB : insertDB,
    deleteDB : deleteDB,
    searchDB : searchDB
}