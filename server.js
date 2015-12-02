/**
 * Copyright (c) Mainflux
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */
var restify = require('restify');
var domain = require('domain');
var config = require('./config/config');


/**
 * RESTIFY
 */

/** Create server */
var server = restify.createServer({
    name: "Mainflux"
});

server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());

console.log('Enabling CORS');
server.use(restify.CORS());
server.use(restify.fullResponse());

//Global error handler
server.use(function(req, res, next) {
    var domainHandler = domain.create();

    domainHandler.on('error', function(err) {
        var errMsg = 'Request: \n' + req + '\n';
        errMsg += 'Response: \n' + res + '\n';
        errMsg += 'Context: \n' + err;
        errMsg += 'Trace: \n' + err.stack + '\n';

        console.log(err.message);

        //logger.error(err.message || '');
    });

    domainHandler.enter();
    next();
});


/**
 * ROUTES
 */
var route = require('./app/routes');
route(server);


/**
 * SERVER START
 */
var port = process.env.PORT || config.port;

console.log('Starting the server');
server.listen(port, function() {
    console.log('%s is running at %s', server.name, server.url);
});


/**
 * Exports
 */
module.exports = server;