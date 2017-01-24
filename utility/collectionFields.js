var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var schema = [
    {
        "_id" : "company",
        "company": {
            "name": "Company",
            "info": "Name of the company"
        },
        "domain": {
            "name": "Domain",
            "info": "Domain name of the company"
        },
        "address": {
            "name": "Address",
            "info": "Street Address of the company"
        },
        "city": {
            "name": "City",
            "info": "Name of the city"
        },
        "state": {
            "name": "State",
            "info": "Name of the state/province"
        },
        "zipcode": {
            "name": "Zipcode",
            "info": "Zip Code or Postal Code"
        },
        "country": {
            "name": "Country",
            "info": "Name of the country"
        },
        "industry": {
            "name": "Industry",
            "info": "Type of industry"
        },
        "sic_code": {
            "name": "SIC Code",
            "info": "SIC (Standard Industrial Classification) code of the industry"
        },
        "revenue": {
            "name": "Revenue",
            "info": "Revenue of the company"
        },
        "employees": {
            "name": "Employees",
            "info": "No. of employees in the company"
        },
        "software": {
            "name": "Software",
            "info": "Softwares being used by the company.Eg. \"BO,BI,BOBJ\" "
        },
        "parent": {
            "name": "Parent",
            "info": "The parent company"
        },
        "status": {
            "name": "Status",
            "info": "Client's Status"
        },
        "account_mgr": {
            "name": "Account Manager",
            "info": "Name of manager dealing with the client"
        },
        "ip_address": {
            "name": "IP Address",
            "info": "IP Address of the company"
        },
        "comment": {
            "name": "Comment",
            "info": "Comments"
        }
    },
    {
        "_id" : "contact",
        "firstName": {
            "name": "First Name",
            "info": "First Name of the person"
        },
        "lastName": {
            "name": "Last Name",
            "info": "Last Name of the person"
        },
        "fullName": {
            "name": "Full Name",
            "info": "Full Name of the person"
        },
        "company": {
            "name": "Company",
            "info": "Name of the company"
        },
        "email": {
            "name": "Email Id",
            "info": "Email Id"
        },
        "companyDomain": {
            "name": "Company Domain",
            "info": "Domain of the company"
        },
        "title": {
            "name": "Title",
            "info": "Title of the contact"
        },
        "titleTag": {
            "name": "Title Tag",
            "info": "Title Tag"
        },
        "city": {
            "name": "City",
            "info": "City"
        },
        "state": {
            "name": "State",
            "info": "State"
        },
        "country": {
            "name": "Country",
            "info": "Country"
        },
        "phoneNo": {
            "name": "Phone No.",
            "info": "Phone No."
        },
        "mobileNo": {
            "name": "Mobile No.",
            "info": "Mobile No."
        },
        "sourceEvent": {
            "name": "Source Event",
            "info": "Source Event"
        },
        "source": {
            "name": "Source",
            "info": "Source of the contact"
        },
        "leadOwner": {
            "name": "Lead Owner",
            "info": "Lead Owner"
        },
        "status": {
            "name": "Status",
            "info": "Status"
        },
        "lastTouchDate": {
            "name": "Last Touch Date",
            "info": "Last Touch Date"
        },
        "emailVerified": {
            "name": "Email Verified",
            "info": "Email Verified"
        },
        "phoneVerified": {
            "name": "Phone Verified",
            "info": "Phone Verified"
        },
        "titleVerified": {
            "name": "Title Verified",
            "info": "Title Verified"
        },
        "companyVerified": {
            "name": "Company Verified",
            "info": "Company Verified"
        },
        "comment": {
            "name": "Comment",
            "info": "Comments"
        }
    }
];

var fiieldsToShow = [
    {
        "_id" : "company",
        "fields" : [
            "company",            
            "address",
            "city",
            "state",
            "country",
            "industry",
            "revenue",
            "employees"            
        ]
    },
    {
        "_id" : "contact",
        "fields" : [
            'firstName',
            'lastName',            
            'company',
            'email',
            'companyDomain',
            'title',            
            'city',
            'state',
            'country',
            'leadOwner',
            'status'           
        ]
    }
];


var populateDB = function (collection_name, insert_arr){
    MongoClient.connect(conf.url, function(err, db) {
        //var collection_name = 'collection_fields';
        var collection = db.collection(collection_name);
        if(insert_arr.length){
            collection.insertMany(insert_arr, function(err, result){  
                if(err){
                    console.log("Error" + err);
                }
                else
                {
                    console.log("Insert Completed");
                }    
                                    
                db.close();
            });
        }                    
    });
};

populateDB('fields_to_show', fiieldsToShow);
