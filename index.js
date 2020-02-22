/*
 *
 * Primariy file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function(req, res) {

    // Get the URL and parse it
    let parsedURL = url.parse(req.url, true);

    // Get the path
    let path = parsedURL.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    let queryStringObject = parsedURL.query;

    // Get http method
    let method = req.method.toUpperCase();

    // Get the headers as an object
    let headers = req.headers;

    // Get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler for this request. If not found default to notFound
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // Construct data object for handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // route the request to chosen handler.
        chosenHandler(data, function(statusCode, payload) {

            // Use the status code from the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use payload from handler or empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert payload to string
            let payloadString = JSON.stringify(payload);

            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`\nreturning this response`, statusCode, payloadString);

        });
    });


});

// Start the server and have it listen on port 3000.
server.listen(3000, function() {
    console.log('The server is listening on port 3000 right now')
});

// Define our handlers
let handlers = {};

// Sample handler 

handlers.sample = function(data, callback) {
    // Callback http status code and payload object
    callback(406, { 'name': 'Sample handler' });
};

// Not found handler

handlers.notFound = function(data, callback) {
    callback(404);

};


// Define a request router
const router = {
    'sample': handlers.sample
}