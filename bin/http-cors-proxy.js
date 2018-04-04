#!/usr/bin/env node

'use strict';
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var program = require('commander');

program
    .version('0.0.3')
    .option('-P, --port <port>', 'Local port', 3000)
    .option('-p, --path <api path>', 'API redirect path', '')
    .option('-r, --remote <http address>', 'Remote address', 'http://localhost:8080')
    .option('-o, --origin <http address>', 'Origin address', 'http://localhost:4000')
    .parse(process.argv);

app.use(cors({
    credentials: true,
    origin: program.origin
}));

app.use(bodyParser.json({
    limit: '100kb'
}));

app.all('*', function (req, res, next) {
    if (req.method === 'OPTIONS') {
        res.send();
        return;
    }
    request({
            url: program.remote + program.path + req.url,
            method: req.method,
            json: req.body,
            headers: req.headers
        },
        function (error, response, body) {
            if (error) {
                console.error('error: ', error);
            }
        }).pipe(res);
});

app.set('port', program.port);

app.listen(app.get('port'), function () {
    console.log('HTTP CORS Proxy listening on port ' + app.get('port'));
});