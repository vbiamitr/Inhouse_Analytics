var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var conf = require('../config/db');
var crud = require('../models/crud');
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  
    var url = "http://localhost:3000/api/visitors-list/date/2016-10-10";
    /*request(url, function(err, serverResponse, body){
        if(!err && serverResponse.statusCode == 200){ */           
            res.render('index', { title: 'Visualbi Website Traffic Analysis API'});
        /*}
        else{
          console.log(err);
        } 
          
    }); */
});

/* Get visitors-list for date provided in parameter */
router.get('/visitors-list/:date/:projection/:skip/:limit', function(req, res, next) {
  var date = req.params['date'];
  var projection_str = req.params['projection'];
  var projectionQuery = crud.buildProjectionQuery(projection_str);
  var query = { 
    "find" : {"date" : date}, 
    "projection" : projectionQuery,
    "skip" : Number(req.params.skip),
    "limit" : Number(req.params.limit)
  };
  MongoClient.connect(conf.clicky_url, function(err, db) {
    var collection_name = 'vbi_visitors';    
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

router.get('/visitors-list-total/:date', function(req, res, next) {
  var date = req.params['date'];
  var query = { 
    find: {"date" : date}    
  };
  MongoClient.connect(conf.clicky_url, function(err, db) {
    var collection_name = 'vbi_visitors';    
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

router.get('/visitors-list/:date/:projection/:skip/:limit/:search', function (req, res, next) {
    var date = req.params['date'];
    var projection_str = req.params['projection'];
    var projectionQuery = crud.buildProjectionQuery(projection_str);
    var query = {        
        "projection" : projectionQuery,
        "skip" : Number(req.params.skip),
        "limit" : Number(req.params.limit)
    };
    var search = req.params.search;        
    try {
        search = JSON.parse(search);
    }
    catch(e){}

    if(typeof search == "string"){
        query.find = {"date" : date, $text:{$search: req.params.search}};
    }
    else {
        query.find = {"date" : date };
        for (var key in search) {            
            if(key != "actions"){
                query.find[key] = {$regex: new RegExp( search[key], 'i')};
            }
            else
            {
                query.find[key] = {$elemMatch: {action_title:{$regex: new RegExp( search[key], 'i')}}}
            }            
        }        
    }      

    MongoClient.connect(conf.clicky_url, function(err, db) {
        var collection_name = 'vbi_visitors';       
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

router.get('/visitors-list-total/:date/:search', function (req, res, next) {
    var date = req.params['date'];
    var query = {};
    var search = req.params.search;        
    try {
        search = JSON.parse(search);
    }
    catch(e){}

    if(typeof search == "string"){
        query.find = {"date" : date, $text:{$search: req.params.search}};
    }
    else {
        query.find = {"date" : date };
        for (var key in search) {
            if(key != "actions"){
                query.find[key] = {$regex: new RegExp( search[key], 'i')};
            }
            else
            {
                query.find[key] = {$elemMatch: {action_title:{$regex: new RegExp( search[key], 'i')}}}
            } 
        } 
    }   
    MongoClient.connect(conf.clicky_url, function(err, db) {
        var collection_name = 'vbi_visitors';    
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

router.get('/visitor-info/:_id', function(req, res, next) {
  var _id = req.params['_id'];
  var query = { 
    "find" : {"_id" : new ObjectID(_id) }    
  };  
  MongoClient.connect(conf.clicky_url, function(err, db) {
    var collection_name = 'vbi_visitors';    
    crud.findOne(db,collection_name,query,function(doc){
        if(doc){
            res.json(doc);
        }
        else
        {
            res.json({ error: true , statusText: 'Could not retrieve data!' });
        }           
        db.close();
    });
 });
});

router.get('/clicky-fields', function(req, res, next) {
    var query = { 
        "find" : {"_id" : 'clicky' }    
    };  
    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'fields_to_show';    
        crud.findOne(db,collection_name,query,function(doc){
            if(doc){
                res.json(doc);
            }
            else
            {
                res.json({ error: true , statusText: 'Could not retrieve data!' });
            }           
            db.close();
        });
    });
});

router.get('/clicky-fieldsinfo', function(req, res, next) {
    var query = { 
        "find" : {"_id" : 'clicky' }    
    };  
    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'collection_fields';    
        crud.findOne(db,collection_name,query,function(doc){
            if(doc){
                res.json(doc);
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
