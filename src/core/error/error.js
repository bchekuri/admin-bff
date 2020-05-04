
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

'use strict'

const log4js = require('log4js');
const util = require('../util');
const errorConstants = require('../../constants/error.constants');

const LOG = log4js.getLogger('error');

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    LOG.error(`Application failed!`);
    if (error.syscall !== 'listen') {
        throw error;
    }
    let port = util.getPort();
    var bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            LOG.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            LOG.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function errorHandler(err, req, res, next) {
    let errorResponse = Object.assign({}, {
        path: req.url,
        timestamp: new Date(),
        status: errorConstants.INTERNAL_SERVER_ERROR.CODE
    });
    if(err && err.status >= errorConstants.BAD_REQUEST.CODE
        && err.status < errorConstants.INTERNAL_SERVER_ERROR.CODE) {
        LOG.debug(`Client Error Stack ${err.stack}`);
        LOG.warn(`Client Error message ${err.message}`);
        errorResponse = Object.assign({}, errorResponse, {
            status: err.status || errorConstants.BAD_REQUEST.CODE,
            id: err.id || errorConstants.BAD_REQUEST.CODE,
            developerText: err.developerText || errorConstants.BAD_REQUEST.MESSAGE,
            message: err.message || errorConstants.BAD_REQUEST.MESSAGE
        });
    } else {
        LOG.error(`Request process failed ${err.stack}`);
        errorResponse = Object.assign({}, errorResponse, {
            status: err.status || errorConstants.INTERNAL_SERVER_ERROR.CODE,
            id: err.id || errorConstants.INTERNAL_SERVER_ERROR.CODE,
            developerText: err.developerText || errorConstants.INTERNAL_SERVER_ERROR.MESSAGE,
            message: err.message || errorConstants.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
    res.status(errorResponse.status);
    res.send(errorResponse);
}

module.exports = {
    onError,
    errorHandler
};