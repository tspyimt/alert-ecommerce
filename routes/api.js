var express = require('express');
var router = express.Router();
var clientSearch = require('../config/settings').clientElastic;

router.post('/insert', function(req, res){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(req.body.queryTest);
        }else{
            query = req.body;
        }
        clientSearch.index(query, function(err){
            if(err){
                console.log('Insert Elastic Error: '+ JSON.stringify(query));
                res.send(false);
            }else{
                console.log('Insert Elastic successfully');
                res.send(true);
            }
        });
    }catch(ex){
        console.log('Insert Elastic Error: '+ JSON.stringify(query));
        res.send(false);
    }
});

router.post('/delete', function(req, res){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(req.body.queryTest);
        }else{
            query = req.body;
        }
        clientSearch.delete(query, function(err){
            if(err){
                console.log('Delete Elastic Error: '+ JSON.stringify(query));
                res.send(false);
            }else{
                console.log('Delete Elastic successfully');
                res.send(true);
            }
        });
    }catch(ex){
        console.log('Delete Elastic Error: '+ JSON.stringify(query));
        res.send(false);
    }
});

router.post('/search', function(req, res){
    var query;
    try{
        if(req.body.queryTest){
            query = JSON.parse(req.body.queryTest);
        }else{
            query = req.body;
        }
        clientSearch.search(query, function(err){
            if(err){
                console.log('Search Elastic Error: '+ JSON.stringify(query));
                res.send(false);
            }else{
                console.log('Search Elastic successfully');
                res.send(true);
            }
        });
    }catch(ex){
        console.log('Search Elastic Error: '+ JSON.stringify(query));
        res.send(false);
    }
});

module.exports = {
    router: router
}