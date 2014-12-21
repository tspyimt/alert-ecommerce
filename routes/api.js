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

module.exports = {
    router: router
}