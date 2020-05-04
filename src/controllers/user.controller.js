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
const config = require('../core/config');
const auth = require('../core/auth.guard');
const util = require('../core/util');
const ClientError = require('../core/error/ClientError');
const errorConstants = require('../constants/error.constants');
const uuid = require('uuid');

/**
 * Logger
 * @type {Logger}
 */
const LOG = log4js.getLogger('user.controller');



module.exports = {
    login : function (req, res) {
        LOG.info(`method=login, stage=start`);
        const username = req.body.username;
        const password = req.body.password;
        if(!Boolean(username) || !Boolean(password)) {
            throw new ClientError(errorConstants.BAD_REQUEST.CODE,
                errorConstants.INVALID_CREDENTIAL.CODE,
                errorConstants.INVALID_CREDENTIAL.MESSAGE,
                errorConstants.INVALID_CREDENTIAL.MESSAGE);
        }
        const jwtId = `${username}-${uuid.v4()}`;
        const payload = Object.freeze({
            id: username,
            jwtid: jwtId,
            roles : {},
            clientIp : util.getClientIPAddress(req)
        });
        const options = config.get('auth.options');
        const token = auth.generateToken(payload, options);
        res.status(200);
        res.send(Object.freeze({
            expires_in: options.expiresIn,
            issued_at: (new Date()).getTime(),
            token_type: config.get('auth.tokenType', 'Bearer'),
            access_token: token
        }));
        LOG.info(`method=login, stage=end`);
    }
}