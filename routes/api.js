var express = require('express');
var router = express.Router();
var clientSearch = require('../models/elasticDB');

router.post('/insert', function(req, res){
    clientSearch.insertDB(req.body, function(status){
        res.send(status);
    })
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
        clientSearch.createSchedule(req.body.userId, req.body.tags, function(status){
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

module.exports = {
    router: router
}