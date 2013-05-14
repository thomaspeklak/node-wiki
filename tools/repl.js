"use strict";
var myrepl = require("repl").start({});
var config = require('../config');
var mongoose = require("mongoose");

mongoose.connect(config.db.url);

myrepl.context['l'] = console.log;

["page"].forEach(function(modName){
        myrepl.context[modName.replace('-', '')] = require('../models/' + modName);
});
