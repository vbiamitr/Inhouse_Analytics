var express = require('express');
var multer = require('multer');
var path = require('path');
var X = require('xlsx');
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
        for(var i=0;i<req.files.length;i++){
            var file = req.files[i];
            var workbook = X.readFile(file.path);
            var sheet_json = to_json(workbook);
            console.log(JSON.stringify(sheet_json));
            console.log("===============================");
        }
        res.send(JSON.stringify(req.files));
    }
    else {
        res.send("Files not found!");
    }

});

module.exports = router;