var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/db');
var crud = require('../models/crud');
var schema = [
    {
        "_id" : "company",
        "company": {
            "name": "Company",
            "info": "Name of the company",
            "type" : "string"
        },
        "domain": {
            "name": "Domain",
            "info": "Domain name of the company",
            "type" : "string"
        },
        "address": {
            "name": "Address",
            "info": "Street Address of the company",
            "type" : "string"
        },
        "city": {
            "name": "City",
            "info": "Name of the city",
            "type" : "string"
        },
        "state": {
            "name": "State",
            "info": "Name of the state/province",
            "type" : "string"
        },
        "zipcode": {
            "name": "Zipcode",
            "info": "Zip Code or Postal Code",
            "type" : "string"
        },
        "country": {
            "name": "Country",
            "info": "Name of the country",
            "type" : "string"
        },
        "industry": {
            "name": "Industry",
            "info": "Type of industry",
            "type" : "string"
        },
        "sic_code": {
            "name": "SIC Code",
            "info": "SIC (Standard Industrial Classification) code of the industry",
            "type" : "string"
        },
        "revenue": {
            "name": "Revenue",
            "info": "Revenue of the company",
            "type" : "string"
        },
        "employees": {
            "name": "Employees",
            "info": "No. of employees in the company",
            "type" : "string"
        },
        "software": {
            "name": "Software",
            "info": "Softwares being used by the company.Eg. \"BO,BI,BOBJ\" ",
            "type" : "string"
        },
        "parent": {
            "name": "Parent",
            "info": "The parent company",
            "type" : "string"
        },
        "status": {
            "name": "Status",
            "info": "Client's Status",
            "type" : "string"
        },
        "account_mgr": {
            "name": "Account Manager",
            "info": "Name of manager dealing with the client",
            "type" : "string"
        },
        "ip_address": {
            "name": "IP Address",
            "info": "IP Address of the company",
            "type" : "string"
        },
        "comments": {
            "name": "Comments",
            "info": "Comments",
            "type" : "array"
        }
    },
    {
        "_id" : "contact",
        "firstName": {
            "name": "First Name",
            "info": "First Name of the person",
            "type" : "string"
        },
        "lastName": {
            "name": "Last Name",
            "info": "Last Name of the person",
            "type" : "string"
        },
        "fullName": {
            "name": "Full Name",
            "info": "Full Name of the person",
            "type" : "string"
        },
        "company": {
            "name": "Company",
            "info": "Name of the company",
            "type" : "string"
        },
        "email": {
            "name": "Email Id",
            "info": "Email Id",
            "type" : "string"
        },
        "companyDomain": {
            "name": "Company Domain",
            "info": "Domain of the company",
            "type" : "string"
        },
        "title": {
            "name": "Title",
            "info": "Title of the contact",
            "type" : "string"
        },
        "titleTag": {
            "name": "Title Tag",
            "info": "Title Tag",
            "type" : "string"
        },
        "city": {
            "name": "City",
            "info": "City",
            "type" : "string"
        },
        "state": {
            "name": "State",
            "info": "State",
            "type" : "string"
        },
        "country": {
            "name": "Country",
            "info": "Country",
            "type" : "string"
        },
        "phoneNo": {
            "name": "Phone No.",
            "info": "Phone No.",
            "type" : "string"
        },
        "mobileNo": {
            "name": "Mobile No.",
            "info": "Mobile No.",
            "type" : "string"
        },
        "sourceEvent": {
            "name": "Source Event",
            "info": "Source Event",
            "type" : "string"
        },
        "source": {
            "name": "Source",
            "info": "Source of the contact",
            "type" : "string"
        },
        "leadOwner": {
            "name": "Lead Owner",
            "info": "Lead Owner",
            "type" : "string"
        },
        "status": {
            "name": "Status",
            "info": "Status",
            "type" : "string"
        },
        "lastTouchDate": {
            "name": "Last Touch Date",
            "info": "Last Touch Date",
            "type" : "string"
        },
        "emailVerified": {
            "name": "Email Verified",
            "info": "Email Verified",
            "type" : "boolean"
        },
        "phoneVerified": {
            "name": "Phone Verified",
            "info": "Phone Verified",
            "type" : "boolean"
        },
        "titleVerified": {
            "name": "Title Verified",
            "info": "Title Verified",
            "type" : "boolean"
        },
        "companyVerified": {
            "name": "Company Verified",
            "info": "Company Verified",
            "type" : "boolean"
        },
        "followup_priority" :{
            "name": "Follow Up Priority",
            "info": "Follow Up Priority",
            "type" : "string"
        },
        "comments": {
            "name": "Comments",
            "info": "Comments",
            "type" : "array"
        }
    },
    {
        "_id" : "clicky",
        actions:  {
            info: "actions",
            name: "actions",
            type: "string"
        },
        country_code:  {
            info: "Country",
            name: "Country",
            type: "string"
        },
        geolocation:  {
            info: "Geolocation",
            name: "Geolocation",
            type: "string"
        },
        ip_address:  {
            info: "IP Address",
            name: "IP Address",
            type: "string"
        },
        landing_page:  {
            info: "Landing Page",
            name: "Landing Page",
            type: "string"
        },
        latitude:  {
            info: "Latitude",
            name: "Latitude",
            type: "string"
        },
        longitude:  {
            info: "Longitude",
            name: "Longitude",
            type: "string"
        },
        operating_system:  {
            info: "Operating System",
            name: "Operating System",
            type: "string"
        },
        organization:  {
            info: "Organization",
            name: "Organization",
            type: "string"
        },
        screen_resolution:  {
            info: "Screen Resolution",
            name: "Screen Resolution",
            type: "string"
        },
        time_pretty:  {
            info: "Date",
            name: "Date",
            type: "string"
        },
        time_total :  {
            info: "Total Time Spent",
            name: "Total Time Spent",
            type: "string"
        },
        total_visits:  {
            info: "Total Visits",
            name: "Total Visits",
            type: "string"
        },
        web_browser:  {
            info: "Web Browser",
            name: "Web Browser",
            type: "string"
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
    },
    {
        "_id" : "clicky",
        "fields" : [
            'ip_address',
            'organization',
            'geolocation',
            'country_code',
            'landing_page'
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

populateDB('fields_to_show', [fiieldsToShow[2]]);
