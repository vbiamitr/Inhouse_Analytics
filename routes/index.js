var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var conf = require('../config/db');
var crud = require('../models/crud');
var router = express.Router();

var root_path = { root: path.join(__dirname, '../public') };
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html', root_path);    
});

router.get('/contactspage/:domain', function (req, res, next) {
    var domain = req.params['domain'];    
    var ejsPath = path.join(root_path.root, 'views/company_contacts');    
    res.render(ejsPath , {"title": "First EJS Page", "items" :{
     "first" : "Car",
     "second" : "Food",
     "third" : "Computer"   
    }});    
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

router.get('/companies/:skip/:limit', function (req, res, next) {

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

router.get('/companies-total', function (req, res, next) {

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

router.get('/companies/:skip/:limit/:search', function (req, res, next) {

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

router.get('/companies-total/:search', function (req, res, next) {

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

router.get('/companies-info/:_id', function(req, res, next) {
  var _id = req.params['_id'];
  var query = { 
    "find" : {"_id" : new ObjectID(_id) }    
  };  
  MongoClient.connect(conf.url, function(err, db) {
    var collection_name = 'company';    
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


router.get('/companies-update/:_id/:field/:value', function(req, res, next) {
  var _id = req.params['_id'];
  var field = req.params['field'];
  var value = req.params['value'];
  var query = [
      {"_id" : new ObjectID(_id) },
      {$set:{}}
  ];
  query[1]['$set'][field] = value; 
  MongoClient.connect(conf.url, function(err, db) {
    var collection_name = 'company';    
    crud.updateOne(db,collection_name,query,function(doc){
        if(doc){
            res.json(doc);
        }
        else
        {
            res.json({ error: true , statusText: 'Could not save data!' });
        }           
        db.close();
    });
 });
});

router.get('/companies-update-comment/:_id/:jsdate/:value', function(req, res, next) {
  var _id = req.params['_id'];
  var jsdate = Number(req.params['jsdate']);
  console.log("jsdate : " + jsdate);
  var value = req.params['value'];  
  var query;
  var queryDelete;
  if(jsdate === -1){
      query = [
            {"_id" : new ObjectID(_id) },
            {$push : { "comments" : { "text" : value, "date" : Date.now() }}}
        ];
  }
  else
  {
      query = [
            {"_id" : new ObjectID(_id) },
            {$push : { "comments" : { "text" : value, "date" : Date.now() }}}
        ];

      queryDelete = [
            {"_id" : new ObjectID(_id) },
            {$pull : { "comments" : { "date" : jsdate}}}
      ];
  }
  
 
  MongoClient.connect(conf.url, function(err, db) {
    var collection_name = 'company';    
    crud.updateOne(db,collection_name,query,function(doc){
        if(doc){
            res.json(query[1]["$push"]["comments"]);
        }
        else
        {
            res.json({ error: true , statusText: 'Could not save data!' });
        }

        if(!queryDelete){
             db.close();
        }
    });

    if(queryDelete){
        crud.updateOne(db,collection_name,queryDelete,function(doc){
            if(!doc){                
               console.log({ error: true , statusText: 'Could not Delete comment!' + JSON.stringify(queryDelete) });
            }
            db.close();
        });
    }
 });
});

router.get('/companies-delete-comment/:_id/:jsdate', function(req, res, next) {
    var _id = req.params['_id'];
    var jsdate = Number(req.params['jsdate']);
    var queryDelete = [
            {"_id" : new ObjectID(_id) },
            {$pull : { "comments" : { "date" : jsdate}}}
      ];
    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'company'; 
        crud.updateOne(db,collection_name,queryDelete,function(doc){
            if(doc){
                res.json(doc);
            }
            else
            {
                res.json({ error: true , statusText: 'Could not Delete comment!' + JSON.stringify(queryDelete) });
            }
            db.close();
        });
    });
});


router.get('/companies-fields', function(req, res, next) {
    var query = { 
        "find" : {"_id" : 'company' }    
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

router.get('/companies-fieldsinfo', function(req, res, next) {
    var query = { 
        "find" : {"_id" : 'company' }    
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