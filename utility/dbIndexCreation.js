var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');

var callCreateIndex = function(indexObj,db, collection){
    collection.createIndex(indexObj, function(err, result){
        if(err){
            console.log(err);            
        }
        else
        {
            console.log("Index created successfully");
        }
        db.close();
    });
};

var generateTextIndex = function (collection_name, indexObj){
    MongoClient.connect(conf.url, function(err, db) {
        //var collection_name = 'collection_fields';
        var collection = db.collection(collection_name);
        collection.indexInformation(function(err, indexObj){
            if(err)
            {
                console.log(err);
                db.close();
                return;
            }
            var textIndexKey = '';
            for(var key in indexObj){
                if(key.indexOf('_text')!=-1){
                    textIndexKey = key;
                    break;
                }
            }

            if(textIndexKey){
                collection.dropIndex(key, function(err, result){
                    if(err){
                        console.log(err);
                        db.close();                       
                    }
                    else
                    {
                        callCreateIndex(indexObj, db, collection);
                    }

                });
            }
            else{
                callCreateIndex(indexObj, db, collection);
            }                   
        });                           
    });
};


var getSchemaInfo = function (collectionField){
     MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'collection_fields';
        var query = { 
            find: {
                '_id' : collectionField
            }           
        };
        crud.findOne(db,collection_name,query,function(doc){
            if(doc){
                 var schemaInfo = doc,
                     indexObj = {};
                 for(var field in schemaInfo){
                     if(schemaInfo[field].type == "string"){
                         indexObj[field] = "text";
                     }
                 }

                 indexObj = JSON.stringify(indexObj);  
                 console.log(indexObj);             
                 //generateTextIndex(collectionField, indexObj); 
            }
            else
            {
                console.log('Could not retrieve data!');
            }           
            db.close();
        });
    });
};

getSchemaInfo('company');