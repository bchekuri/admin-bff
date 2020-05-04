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

const log4js = require('log4js');
const config = require('./config');

/**
 * Logger
 * @type {Logger}
 */
const LOG = log4js.getLogger('util');

module.exports = {
    /**
     * Return port number
     * @returns {*}
     */
    getPort: function(){
        let post = process.env.PORT || config.get(`server.port`, 3000);
        return this.normalizePort(post);
    },
    /**
     * Returns valid port number
     * @param val
     * @returns {*}
     */
    normalizePort: function(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    },
    
    getClientIPAddress: function (req) {
        const xForwardedIP = req.header('x-forwarded-for');
        LOG.debug(`Client IP Address from x-forwarded-for ${xForwardedIP}`);
        const clientIP = xForwardedIP || req.connection.remoteAddress;
        LOG.debug(`Client IP Address ${clientIP}`);
        return clientIP;
    }
};
