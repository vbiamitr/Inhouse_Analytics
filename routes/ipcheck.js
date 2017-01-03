var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var conf = require('../config/db');
var crud = require('../models/crud');
var moment = require('moment');
var Promise = require("bluebird");
var request = require('request');
var router = express.Router();

function numericToIp(n){
    var ip_arr = [];
    ip_arr[0] = (n >>> 24) % 256;
    ip_arr[1] = (n >>> 16) % 256;
    ip_arr[2] = (n >>> 8) % 256;
    ip_arr[3] = n % 256;
    return ip_arr.join('.');    
}

function ipToNumeric(ip){
    var ip_arr = ip.split('.');
    ip_arr = ip_arr.map(ip => Number(ip));
    return ip_arr[0] * 16777216 + ip_arr[1] * 65536 + ip_arr[2] * 256 + ip_arr[3];
}

router.get('/dbip_api/:ip', function(req, res, next) {
  var api_key = '8d3aa1762b1005a7dfd590e5ac5dabfc0973e891';
  var ip = req.params['ip'];
  var url = "http://api.db-ip.com/v2/" + api_key + "/" + ip;
  request(url, function(err, serverResponse, body){
    if(!err && serverResponse.statusCode == 200){			
          if(typeof body == "object"){
			  body = JSON.stringify(body);
		  }
          res.send(body);
      }
	  else{
		  var error = {
			  error : err
		  }
		  res.send(JSON.stringify(error));
		  console.log(err);
	  }
  });
});

router.get('/:ip', function(req, res, next) {
  var ip = req.params['ip'];
  var numeric_ip = ipToNumeric(ip);  
  console.log("numeric_ip : " + numeric_ip);

  MongoClient.connect(conf.iplocationdb_url, function(err, db) {
    var collection_name = 'IP';
    var query = {};
    query.find = {$and : [{'startIP': {$lte : numeric_ip}}, {'endIP': {$gte : numeric_ip}}]};     
    crud.findOne(db,collection_name,query,function(doc){
        if(doc){
            //res.json(doc);
            var info = doc;
            var promise_arr = [];
            console.log('ip done');


            // Find Organization
           promise_arr.push(
                new Promise(function(resolve, reject){
                   collection_name = 'Organization';            
                   crud.findOne(db,collection_name,query,function(doc){
                        if(doc){
                            info['organization'] = doc['organization'];
                            console.log('organization done');                            
                        }
                        else {
                             info['organization'] = '';                             
                        }
                        resolve();
                    });
               })
           ); 

            // Find ISP
            promise_arr.push(
                new Promise(function(resolve, reject){
                    collection_name = 'ISP';            
                    crud.findOne(db,collection_name,query,function(doc){
                        if(doc){
                            info['isp'] = doc['isp'];
                            console.log('ISP done');                            
                        }
                        else{
                           info['isp'] = ''; 
                        }
                        resolve();
                    });
               })
            );

            // Find Location
            promise_arr.push(
              new Promise(function(resolve, reject){
                collection_name = 'Location';
                var location_query = {find : {'locationID': info['locationID']}};  
                var countryCode = '';           
                crud.findOne(db,collection_name,location_query,function(doc){
                    if(doc){                    
                        info['city'] = doc['city'];
                        info['postalCode'] = doc['postalCode'];
                        info['latitude'] = doc['latitude'];
                        info['longitude'] = doc['longitude'];
                        info['country'] = doc['country'];
                        info['region'] = doc['region'];
                        countryCode =  info['country'];
                        console.log('Location done');                                          
                    }
                    else {
                        info['city'] = '';
                        info['postalCode'] = '';
                        info['latitude'] = '';
                        info['longitude'] = '';
                        info['country'] = '';
                        info['region'] = '';
                    }
                    
                    // Find Region
                    var promise_arr_inner = [];
                    promise_arr_inner.push(
                        new Promise(function(resolve1, reject1){
                            collection_name = 'Region';
                            if(info['country'] && info['region']){
                                var region_query = {find : {'countryCode': countryCode, 'regionCode': info['region']}};
                                crud.findOne(db,collection_name,region_query,function(doc){
                                    if(doc){
                                        info['region'] = doc['regionName'];
                                        console.log('Region done');
                                        resolve1();
                                    }
                                });
                            }
                            else{
                                resolve1();
                            }
                            
                        })
                    );

                    // Find Country
                    promise_arr_inner.push(
                        new Promise(function(resolve1, reject1){
                            collection_name = 'Country';
                            if(info['country']){
                                var country_query = {find: {'countryCode': countryCode}};
                                crud.findOne(db,collection_name,country_query,function(doc){
                                    if(doc){
                                        info['country'] = doc['countryName'];
                                        console.log('Country done');
                                        resolve1();
                                    }
                                });
                            }
                            else
                            {
                                resolve1();
                            }                    
                        })
                    );
                    Promise.all(promise_arr_inner).then(function(){
                        resolve();
                    });                    
                });
               })
            );          

             Promise.all(promise_arr).then(function(){
                 res.json(info);
                 db.close();
             })
             .error(function(e){
                 res.json({ error: true , statusText: 'Some error!' + e });
             });
        }
        else
        {
            res.json({ error: true , statusText: 'Could not retrieve data!' });
            db.close();
        }           
        
    });
 });
});

module.exports = router;
