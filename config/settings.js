/**
 * Created by qgs on 11/24/14.
 */
var elasticsearch = require('elasticsearch');
var clientElastic = new elasticsearch.Client({
    //host: 'localhost:9200',
    //log: 'trace'
    host: 'https://Ihkl5henvkmLs3GUuzE6wgHb2i0Sm0C0:@ga.east-us.azr.facetflow.io'
});

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

clientElastic.indices.create({
    index: 'blog4',
    body: {
        settings: settings,
        mapping: {
            'post': {
                'properties': {
                    'title': {
                        type: 'string'
                    },
                    'date' : {
                        type: 'date'
                    },
                    'content': {
                        type: 'string'
                    }
                }
            }
        }
    }
}, function(err){
    if(err) console.log(err);
    console.log('Settings finished');
});

module.exports = {
    clientElastic: clientElastic
}