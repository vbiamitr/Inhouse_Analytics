module.exports = {
    insertOne : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.insertOne(query, function(err, r){
            cb();
        });
    },
    insertMany : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.insertMany(query, function(err, r){
            if(err){
                console.error("Error: " + err);
            }
            cb();
        });
    },
    updateOne : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.updateOne(query[0],query[1], function(err, r){
            if(err){
                console.log(err);
            }
            cb(r);
        });
    },
    updateMany : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.updateMany(query[0],query[1], function(err, r){
            cb();
        });
    },
    deleteOne : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.deleteOne(query, function(err, r){
            cb();
        });
    },
    deleteMany : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.deleteMany(query, function(err, r){
            cb();
        });
    },
    count: function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.count(query.find,function(err, count){
            cb(count);
        });
    },
    find : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        if(query.skip && query.limit){
            collection.find(query.find, query.projection ? query.projection : {} ).skip(query.skip).limit(query.limit).toArray(function(err, docs){
                console.log(err);
                cb(docs);
            });
        }
        else if(query.skip){
            collection.find(query.find, query.projection ? query.projection : {}).skip(query.skip).toArray(function(err, docs){
                console.log(err);
                cb(docs);
            });
        }
        else if(query.limit){
             collection.find(query.find, query.projection ? query.projection : {}).limit(query.limit).toArray(function(err, docs){
                console.log(err);
                cb(docs);
            });
        }
        else{
            collection.find(query.find, query.projection ? query.projection : {}).toArray(function(err, docs){
                console.log(err);
                cb(docs);
            });
        }        
    }, 
    findOne : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.findOne(query.find, query.projection ? query.projection : {}, function(err, doc){
            console.log(err);
            cb(doc);
        });
    },   
    upsert: function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.updateOne(query[0], query[1], {upsert: true},function(err, r){
            cb();
        });
    },
    insertIfNotExistUnorderedBulkOperation : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name),           
            columns = query.columns,
            qfind = {},
            l_doc = {},
            l_key = '',        
            docs_to_save = query.docs,
            insert_arr = [],
            fields = query.collectionFields,
            getData = function(col, val){
                var type = fields[col].type,
                    initData = {
                        'string' : function(data){
                            return typeof data === "undefined" ? '' : data;
                        },
                        'number' : function(data){
                            return typeof data === "undefined" ? 0 : Number(data);
                        },
                        'boolean' : function(data){
                            return  data && (data === "true" || data === true) ? true : false;
                        },
                        'array' : function(data){
                            var ret = [];
                            if(typeof data === "undefined"){
                                return ret;
                            }
                            if(col === 'comments'){
                                var commentObj = {};
                                commentObj.date = Date.now();
                                commentObj.text = data;
                                ret.push(commentObj);
                            }
                            else
                            {
                               ret.push(data);
                            }
                            return ret;                            
                        }                
                    };

                if(initData[type]){
                    return initData[type](val);
                }
                else{
                    return initData['string'](val);
                }            
        };
        // Recursive function to check if the record exist then update otherwise push the record to insert Array.
        function checkDocsToInsertOrUpdate(docs) {
            var doc,
                u_doc, /* update Doc */
                i_doc; /* insert Doc */
                

            if (docs_to_save.length) {
                doc = docs_to_save.shift();
                u_doc = {};
                i_doc = {};
                columns.forEach(function (col) {
                    if(typeof doc[col] != "undefined"){
                        u_doc[col] = getData(col, doc[col]); 
                    }                     
                    i_doc[col] = u_doc[col] || getData(col, doc[col]);                                     
                });
                if (u_doc[query.find]) {
                    qfind[query.find] = u_doc[query.find];
                    console.log("^^^^^^^^^^^^^^^^^^^^^^^^u_doc = " + JSON.stringify(u_doc));
                    collection.updateOne(qfind,{ $set: u_doc }, function(err, result){
                        console.log("result.result.n = " + JSON.stringify(result.result));
                        if(!result.result.n){
                            insert_arr.push(i_doc);
                        } 
                        checkDocsToInsertOrUpdate(docs);
                    });                    
                }
                else {
                    checkDocsToInsertOrUpdate(docs);
                }
            }
            else {
                if(insert_arr.length){
                    collection.insertMany(insert_arr, function(err, result){  
                        if(err){
                            console.log("Error : " + err);
                        }                      
                        cb();
                    });
                }
                else{
                    console.log("in Else");
                    cb();
                }                                             
            }
        }
        checkDocsToInsertOrUpdate(docs_to_save);
    },
    buildProjectionQuery : function(projection_params){
        var query = {};
        var projection_arr = projection_params.split(',');
        for(var i=0, len=projection_arr.length; i<len; i++){
            query[projection_arr[i].trim()] = 1;
        }
        return query;
    }

}