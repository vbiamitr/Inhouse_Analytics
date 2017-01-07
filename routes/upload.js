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
        cb(null, path.join( __dirname, '../uploads' ));
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


/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html', root_path);    
});

router.post('/xlsx', upload.any(), function (req, res, next) {
    if (req.files) {
        var columns = ['company', 'domain', 'address', 'city', 'state', 'zipcode', 'country', 'industry', 'sic_code', 'revenue', 'employees', 'software', 'parent', 'status', 'account_mgr', 'ip_address'];
        for(var i=0;i<req.files.length;i++){
            var file = req.files[i];
            var workbook = X.readFile(file.path);
            var sheet_json = to_json(workbook);
            var query ={columns: columns, find:'domain', docs:[]};
            for(var sheet in sheet_json){
                query.docs = query.docs.concat(sheet_json[sheet]);
            };
           
           MongoClient.connect(conf.url, function(err, db) {
                var collection_name = 'company';
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

router.get('/getcompanyfiles', function (req, res, next) {
    const companyDir = path.join( __dirname, '../uploads' );
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
    const companyDir = path.join( __dirname, '../uploads' );    
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
    const companyDir = path.join( __dirname, '../uploads' );     
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