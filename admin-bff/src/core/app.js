/*
 * Copyright (c) 2019.  BChekuri
 *
 * Licensed under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *              http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const config = require('./config');
const logger = require('./logger');
const middlewareLogger = require('./middleware.logger');
const log4js = require('log4js');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const error = require('./error/error');
const routes = require('../routes/index');
const util = require('./util');
const auth = require('./auth.guard');

/**
 * Initialize log4js
 */
logger.configureLog4js();

/**
 * Logger
 * @type {Logger}
 */
const LOG = log4js.getLogger('app');

/**
 * Add all the routes to express
 * @param app
 */
function initializeRoutes(app) {
    app.use(config.get(`server.contextPath`, `/api/`), routes());
}

/**
 * View Engine Setup
 * @param app
 */
function initializeViewEngineAndAsserts(app) {
    app.set('views', config.get(`express.viewPath`, path.join(__dirname, '..', '..', 'views')));
    app.set('view engine', config.get(`express.viewEngine`, `ejs`));
    app.use(express.static(config.get(`express.staticPath`, path.join(__dirname, '..', '..', 'assets'))));
}

/**
 * This method will be used to initilize view routes
 * @param app
 */
function initializeViewRoutes(app) {
    app.use(/^((?!(api)).)*/, (req, res) => {
        res.status(200);
        res.render(config.get('express.view', "index.view.ejs"));
    });
}

/**
 * Setup Logging for this application
 * @param app
 */
function initializeMiddlewareLogger(app) {
    app.use(middlewareLogger.configureMiddlewareLog4js());
}

/**
 * initialize Authorization
 * @param app
 */
function initializeAuth(app) {
    app.use(auth.setup());
}

/**
 * Setup middleware
 * @param app
 */
function initializeMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}

/**
 * Catch 404 and forward to error handler
 * @param app
 */
function handlePageNotFound(app) {
    app.use(function(req, res, next) {
        LOG.error(`${req.url} URL Not found!`);
        res.status(404);
        res.send({path: req.url,
            timestamp: new Date(),
            status: 404,
            message: 'Not Found!'
        });
    });
}

/**
 * Express Error handler
 * @param app
 */
function errorHandler(app) {
    app.use(error.errorHandler);
}

/**
 * Setup Express Handler
 * @returns {*|Function}
 */
function setupMiddlewareHandler() {
    var app = express();
    initializeAuth(app);
    initializeMiddleware(app);
    initializeMiddlewareLogger(app);
    initializeViewEngineAndAsserts(app);
    initializeRoutes(app);
    initializeViewRoutes(app);
    handlePageNotFound(app);
    errorHandler(app);
    return app;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server) {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? `Pipe  + ${addr}`
        : `Host - ${addr.address}:${addr.port}`;
    console.log(chalk.green(`${config.get(`app.name`, "testApp")} Listening on ${bind}`));
    LOG.info(`${config.get(`app.name`, "testApp")} Listening on ${bind}`);
}

/**
 * start server
 */
function start() {
    var server = http.createServer(setupMiddlewareHandler());
    server.listen(util.getPort());
    server.on('error', function (err) {
        error.onError(err);
    });
    server.on('listening', function () {
        onListening(server);
    });
};

module.exports = {
    start
};