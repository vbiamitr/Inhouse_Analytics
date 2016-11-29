var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var router = express.Router();

var root_path = { root: path.join(__dirname, '../public') };
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html', root_path);    
});

router.get('/getcompany', function (req, res, next) {

    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company';
        var query = {
            find:{}
        };
        crud.find(db,collection_name,query,function(docs){
            if(docs && docs.length){
                 res.json(docs);
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });   
});

router.get('/getcompany/:skip/:limit', function (req, res, next) {

    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company';
        var query = { 
            find: {}, 
            skip: Number(req.params.skip),
            limit: Number(req.params.limit)
        };
        crud.find(db,collection_name,query,function(docs){
            if(docs && docs.length){
                 res.json(docs);
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });   
});

router.get('/getcompany_total', function (req, res, next) {

    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company';
        var query = { 
            find: {}            
        };
        crud.count(db,collection_name,query,function(count){
            if(typeof count != "undefined"){
                 res.json({cursor_total: count});
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });   
});

router.get('/getcompany/:skip/:limit/:search', function (req, res, next) {

    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company';
        var search = req.params.search;
        var query = {
            skip: Number(req.params.skip),
            limit: Number(req.params.limit)
        };
        try {
            search = JSON.parse(search);
        }
        catch(e){}

        if(typeof search == "string"){
            query.find = {$text:{$search: req.params.search}};
        }
        else {
            var q_obj = {};
            for (var key in search) {
                q_obj[key] = {$regex: new RegExp('^' + search[key], 'i')};
            }
            query.find = q_obj;
        }
        
        crud.find(db,collection_name,query,function(docs){
            if(docs && docs.length){
                 res.json(docs);
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });   
});

router.get('/getcompany_total/:search', function (req, res, next) {

    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company';       
        var search = req.params.search;
        var query = {};
        try {
            search = JSON.parse(search);
        }
        catch(e){}

        if(typeof search == "string"){
            query.find = {$text:{$search: req.params.search}};
        }
        else {
            var q_obj = {};
            for (var key in search) {
                q_obj[key] = {$regex: new RegExp('^' + search[key], 'i')};
            }
            query.find = q_obj;
        }
        crud.count(db,collection_name,query,function(count){
            if(typeof count != "undefined"){
                 res.json({cursor_total: count});
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });   
});

module.exports = router;