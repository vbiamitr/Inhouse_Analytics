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
            cb();
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
            collection.find(query.find).skip(query.skip).limit(query.limit).toArray(function(err, docs){
                cb(docs);
            });
        }
        else if(query.skip){
            collection.find(query.find).skip(query.skip).toArray(function(err, docs){
                cb(docs);
            });
        }
        else if(query.limit){
             collection.find(query.find).limit(query.limit).toArray(function(err, docs){
                cb(docs);
            });
        }
        else{
            collection.find(query).toArray(function(err, docs){
                cb(docs);
            });
        }        
    },    
    upsert: function(db, collection_name, query, cb){
        var collection = db.collection(collection_name);
        collection.updateOne(query[0], query[1], {upsert: true},function(err, r){
            cb();
        });
    },
    insertIfNotExistUnorderedBulkOperation : function(db, collection_name, query, cb){
        var collection = db.collection(collection_name),
            batch = collection.initializeUnorderedBulkOp({useLegacyOps: true}),
            columns = query.columns,
            qfind = {},
            l_doc = {},
            l_key = '';        
        query.docs.forEach(function(doc){
            l_doc = {};
            columns.forEach(function(col){
                l_doc[col] = doc[col] || '';
            });
                       
            if(l_doc[query.find]){
                qfind[query.find] = l_doc[query.find];
                batch.find(qfind).upsert().updateOne({$setOnInsert : l_doc});
            }            
        });
        batch.execute(function(err, result){
            cb();
        });
    }
}