var express = require('express');
var router = express.Router();
var clientSearch = require('../models/elasticDB');

router.post('/insert', function(req, res){
    try{
        var query;
        if(req.body.queryTest){
            query = JSON.parse(req.body.queryTest);
        }else{
            query = req.body;
        }
        clientSearch.insertDB(query, function(status){
            res.send(status);
        })
    }catch(ex){
        console.log(ex);
        res.send(false);
    }
});

router.post('/delete', function(req, res){
    clientSearch.deleteDB(req.body, function(status){
        res.send(status);
    })
});

router.post('/search', function(req, res){
    clientSearch.searchDB(req.body, function(status){
        res.send(status);
    })
});

router.get('/schedule/getById:id', function(req, res){
    clientSearch.getScheduleById(req.param('id'), function(data){
        res.send(data);
    });
});

router.post('/schedule/add', function(req, res){
    if(req.body.userId && req.body.tags){
        clientSearch.createSchedule(req.body, function(status){
            res.send(status);
        })
    }else{
        console.log('/schedule/add: Missing param');
        res.send(false);
    }
});

router.get('/schedule/delete:id', function(req, res){
    clientSearch.deleteSchedule(req.param('id'), function(data){
        res.send(data);
    });
});

router.post('/testNode', function(req, res){
    clientSearch.sendNotiWhenNewNode(req.body.nodeId, function(status){
        res.send(status);
    })
});

module.exports = {
    router: router
}