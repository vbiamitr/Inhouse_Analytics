var express = require('express');
var multer = require('multer');
var path = require('path');
var X = require('xlsx');
var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join( __dirname, '../uploads/contact' ));
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var ext_i = filename.lastIndexOf('.');
        var newfilename = filename.substring(0, ext_i) + '_' + Date.now() + filename.substring(ext_i);
        cb(null, newfilename);
    }
});

var upload = multer({
    storage: storage
});

var root_path = { root: path.join(__dirname, '../public') };

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

var schemaInfo = {};

(function getSchemaInfo(){
     MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'collection_fields';
        var query = { 
            find: {
                '_id' : 'contact'
            }           
        };
        crud.findOne(db,collection_name,query,function(doc){
            if(doc){
                 schemaInfo = doc;
                 console.log(JSON.stringify(schemaInfo));
            }
            else
            {
                console.log('Could not retrieve data!');
            }           
            db.close();
        });
    });
})();



/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html', root_path);    
});

router.get('/schema-info', function(req, res, next){
    MongoClient.connect(conf.url, function(err, db) {
        var collection_name = 'collection_fields';
        var query = { 
            find: {
                '_id' : 'contact'
            }           
        };
        crud.findOne(db,collection_name,query,function(doc){
            if(doc){
                 schemaInfo = doc;
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

router.post('/xlsx', upload.any(), function (req, res, next) {
    if (req.files) {
        
        var columns = Object.keys(schemaInfo).slice(1);

        for(var i=0;i<req.files.length;i++){
            var file = req.files[i];
            var workbook = X.readFile(file.path);
            var sheet_json = to_json(workbook);
            var query ={columns: columns, find:'email', docs:[]};
            query.collectionFields = schemaInfo;            
            for(var sheet in sheet_json){
                query.docs = query.docs.concat(sheet_json[sheet]);
            };           
           MongoClient.connect(conf.url, function(err, db) {
                var collection_name = 'contact';
                crud.insertIfNotExistUnorderedBulkOperation(db,collection_name,query,function(){
                    res.send('Document saved in database');
                    db.close();
                });
            });            
        }        
    }
    else {
        res.send("Files not found!");
    }
});

router.get('/getcontactfiles', function (req, res, next) {
    const companyDir = path.join( __dirname, '../uploads/contact' );
    const fs = require('fs');
    fs.readdir(companyDir, (err, files) => {
        if(err){
            console.log(err);
        }
        files.reverse();
        res.json({files:files});
    });
});

router.get('/deletefile/:file', function (req, res, next) {
    var file = req.params.file;
    var status = {};
    const fs = require('fs');
    const companyDir = path.join( __dirname, '../uploads/contact' );    
    if(file){       
        fs.unlink(path.join(companyDir, file), function(err){
            if(err){
                console.error(err);
                status.error = err;                
            }
            else {
                status.status = "File deleted successfully";
            }
            res.json(status);
            
        })
    }
    else
    {
        status.status = "No file to delete";
        res.json(status);
    }    
});

router.get('/downloadfile/:file', function (req, res, next) {
    var file = req.params.file;
    var status = {};
    const fs = require('fs');
    const companyDir = path.join( __dirname, '../uploads/contact' );     
    var filename = file;
    var ext_i = filename.lastIndexOf('.');
    var tmp_i = filename.lastIndexOf('_');       
    var newfilename = filename.substring(0, tmp_i) +  filename.substring(ext_i);     
    res.download(path.join(companyDir, file),newfilename, function(err){
        console.error(err);
        res.status(404).end();
    });      
});

module.exports = router;