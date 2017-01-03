var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var csv = require("fast-csv");
var batch = [];
var obj = {};
var BATCH_SIZE = 1000;
var counter = 0;
var dir_path = process.argv[2];
var filePattern = new RegExp('^IPLocationDB-');
var populateDB = function (db, collection_name, insert_arr){           
        var collection = db.collection(collection_name);
        if(insert_arr.length){
            collection.insertMany(insert_arr, function(err, result){  
               // counter++;                   
                
            });
        }
};

var processCsvFiles = function(files, db){
    if(files.length){
        var file = files.pop();        
        if(filePattern.test(file) && file.substr(file.length-4) == '.csv'){
            var file_path = path.join(dir_path, file);
            var collection_name = file.split('.')[0].split('-')[1];
            var line = 0;
            var cols = [];
            csv
                .fromPath(file_path, {escape:"\\"})                    
                .on("data", function(data){
                    obj = {};
                    line++;  
                    if(line==1){
                        cols = cols.concat(data);
                        console.log("Processing collection : " + collection_name);
                        console.log(cols);
                    }
                    else{
                        cols.forEach(function(col, index){
                            obj[col] = isNaN(Number(data[index])) ? data[index] : Number(data[index]);
                        });
                        batch.push(obj);
                    }                                             
                    
                    if(batch.length == BATCH_SIZE){
                        var insert_arr = [];
                        insert_arr = insert_arr.concat(batch);
                        batch = [];
                        populateDB(db, collection_name, insert_arr);
                    }          
                })
                .on("end", function(){
                    var insert_arr = [];
                    insert_arr = insert_arr.concat(batch);
                    batch = [];
                    populateDB(db, collection_name, insert_arr);
                    console.log("End Processing collection : " + collection_name);
                    processCsvFiles(files, db);
                });
        }
        else {
            processCsvFiles(files, db);
        }
    }
    else{
        console.log("Finished Processing all the files");
        db.close();
    }
};

var mergeCollections = function(){
    var collections = ['IP', 'Organization', 'ISP', 'Location', 'Country', 'Region'];

}

fs.readdir(dir_path, function(err, files){
    if(err){
        console.log(err);        
    }
    else
    {
        console.log(files);
        MongoClient.connect(conf.iplocationdb_url, function(err, db) {
            if(err){
                console.log("Error in database connection :" + err);
            }
            else {
                processCsvFiles(files,db);
            }
            
        });
    }    
});