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
        collection.find(query.find).count(function(err, count){
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
           // batch = collection.initializeOrderedBulkOp(),
            columns = query.columns,
            qfind = {},
            l_doc = {},
            l_key = '';        
        var docs_to_save = query.docs;
        var insert_arr = [];

        // Recursive function to check if the record exist then update otherwise push the record to insert Array.
        function checkDocsToInsertOrUpdate(docs) {
            if (docs_to_save.length) {
                var doc = docs_to_save.shift();
                l_doc = {};
                columns.forEach(function (col) {
                    if(typeof doc[col] != "undefined"){
                        l_doc[col] = doc[col];
                    }                     
                });
                if (l_doc[query.find]) {
                    qfind[query.find] = l_doc[query.find];
                    collection.updateOne(qfind,{ $set: l_doc }, function(err, result){
                        if(!result.result.n){
                            insert_arr.push(l_doc);
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
                        cb();
                    });
                }
                else{
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
            query[projection_arr[i]] = 1;
        }
        return query;
    }

}