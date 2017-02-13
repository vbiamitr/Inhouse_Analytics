angular.module('companyServiceModule',[])
    .factory('companyService', ['$http', 'utilityService', function($http, utilityService){
        var service = {};
        var apiMap = {            
            "getRecord" : {
                "company" : "companies",
                "contact" : "contacts/contacts",
                "clicky" : "clicky/visitors-list"
            },

            "getRecordTotal" : {
                "company" : "companies-total",
                "contact" : "contacts/contacts-total",
                "clicky" : "clicky/visitors-list-total"
            },

            "getRecordInfo" : {
                "company" : "companies-info",
                "contact" : "contacts/contacts-info",
                "clicky" : "clicky/visitor-info"
            },

            "updateRecordInfo" : {
                "company" : "companies-update",
                "contact" : "contacts/contacts-update",
                "clicky" : "clicky/clicky-update"
            },

            "updateComment" : {
                "company" : "companies-update-comment",
                "contact" : "contacts/contacts-update-comment"
            },

            "deleteComment" : {
                "company" : "companies-delete-comment",
                "contact" : "contacts/contacts-delete-comment"
            },

            "getFields" : {
                "company" : "companies-fields",
                "contact" : "contacts/contacts-fields",
                "clicky" : "clicky/clicky-fields"
            },

            "getFieldsInfo" : {
                "company" : "companies-fieldsinfo",
                "contact" : "contacts/contacts-fieldsinfo",
                "clicky" : "clicky/clicky-fieldsinfo"
            },

            "getContactsCount" :{
                "company" : "contacts/contacts-count"
            }
        };

        
        // for custom methods
        var methodMap  = {
            "getRecord" : {
                "clicky" : function(options, cb){
                    var methodName = "getRecord",
                        collection = "clicky",
                        api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options.date, options.projection.join(','), options.skip, options.limit];
                        if(typeof options.search != "undefined"){
                            urlParams.push(options.search);            
                        }             
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                }
            },
            "getRecordTotal" : {
                "clicky" : function(options, cb){
                    var methodName = "getRecordTotal",
                        collection = "clicky",
                        api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options.date];
                        if(typeof options.search != "undefined"){
                            urlParams.push(options.search);            
                        }             
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                }
            },
            "getContactsCount" : {
                "company" : function(options, cb){
                    var methodName = "getContactsCount",
                        collection = "company",
                        api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options.companyDomain];
                        if(typeof options.search != "undefined"){
                            urlParams.push(options.search);            
                        }             
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                }
            }
        };

        var internalMethods = {

            "getRecord" :  function(options){            
                var methodName = "getRecord",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options.skip, options.limit];
                        if(typeof options.search != "undefined"){
                            urlParams.push(options.search);            
                        }             
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "getRecordTotal" : function(options){
                var methodName = "getRecordTotal",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url , api];
                        if(typeof options.search != "undefined"){
                            urlParams.push(options.search);            
                        }
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "getRecordInfo" : function(options){
                var methodName = "getRecordInfo",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url , api, options._id];                    
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "updateRecordInfo" : function(options){
                var methodName = "updateRecordInfo",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options._id, options.field, options.val];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "updateComment" : function(options){
                var methodName = "updateComment",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options._id, options.jsdate, options.val];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "deleteComment" : function(options){
                var methodName = "deleteComment",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options._id, options.jsdate];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "getFieldsInfo" : function(options){
                var methodName = "getFieldsInfo",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },

            "getFields" : function(options){
                var methodName = "getFields",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            },
            "getContactsCount" : function(options){
                var methodName = "getContactsCount",
                    defaultFunc,
                    collection = options.collection,
                    fn = methodMap[methodName] && methodMap[methodName][collection] ? methodMap[methodName][collection] : null;
                    
                if(fn){
                    return  fn;
                }

                defaultFunc = function(options, cb){
                    var api = apiMap[methodName][collection] || '',
                        urlParams;
                    if(api){
                        urlParams = [utilityService.server_base_url ,api, options.companyDomain];
                        utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
                    }
                    else
                    {
                        console.error("Error: " + methodName + " Implementation for " + collection + " not found");
                    }
                };            
                return defaultFunc;
            }
        };

        service.initMethods = function(options, methodArr){
            var exportMethods = {};
            if(methodArr && methodArr.length){
                methodArr.forEach(function(key){
                    exportMethods[key] = internalMethods[key](options);
                });
            }
            else
            {
                for(var key in internalMethods){
                    exportMethods[key] = internalMethods[key](options);
                }
            }
            
            return exportMethods;
        };

        return service;        
    }]);