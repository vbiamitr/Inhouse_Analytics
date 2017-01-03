var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var file_path = process.argv[2];

// fast-csv implementation

var csv = require("fast-csv");
var cols = [
    'ip_start',
    'ip_end',
    'country',
    'stateprov',
    'city',
    'latitude',
    'longitude',
    'timezone_offset',
    'location',
    'isp',
    'connection_type',
    'organization'
];

var batch = [];
var obj = {};
var BATCH_SIZE = 1000;
var counter = 0;
var populateDB = function (insert_arr){
    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'dbip';
        var collection = db.collection(collection_name);
        if(insert_arr.length){
            collection.insertMany(insert_arr, function(err, result){  
                counter++;  
                console.log("Batch Completed=" + counter);                    
                db.close();
            });
        }                    
    });
};


if (fs.existsSync(file_path)) {  
    csv
       .fromPath(file_path, {quote:"\"", escape:"\\"})
        
        .on("data", function(data){
            obj = {};
            cols.forEach(function(col, index){
                obj[col] = data[index];
            });
            batch.push(obj);
            if(batch.length == BATCH_SIZE){
                var insert_arr = [];
                insert_arr = insert_arr.concat(batch);
                batch = [];
                populateDB(insert_arr);
            }          
        })
        .on("end", function(){
            var insert_arr = [];
            insert_arr = insert_arr.concat(batch);
            batch = [];
            populateDB(insert_arr);
            console.log("done");
        });
}
else {
    console.log("File not found!");
}