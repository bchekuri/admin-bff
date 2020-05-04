
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
const config = require('./config');
const constants = require('../constants/constants');
const errorConstants = require('../constants/error.constants');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

/**
 * Logger
 * @type {Logger}
 */
const LOG = log4js.getLogger('authGuard');

/**
 * ExtractJwt
 */
const ExtractJwt = passportJWT.ExtractJwt;

/**
 * JwtStrategy
 */
const JwtStrategy = passportJWT.Strategy;

/**
 * Default Secret Key
 * @type {string}
 */
const defaultSecretKey = "mySecretKey";



module.exports = {
    /**
     * Creating strategy
     */
    strategy: function () {
        LOG.info('method=strategy, stage=start');
        /**
         * secret key extracted from environmental config file.
         */
        const secretKey = Buffer.from((config.get('auth.secretKey', '')
            || defaultSecretKey), 'base64').toString('ascii');
        /**
         * JSON Web token options
         * @type {{jwtFromRequest: *, secretOrKey: *}}
         */
        const jwtOptions = {...{jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: secretKey}};
        /**
         * Creating JWT Strategy
         */
        return new JwtStrategy(jwtOptions, function(jwtPayload, done) {
                if (jwtPayload) {
                    done(null, jwtPayload);
                } else {
                    done(null, false);
                }
            });
    },
    /**
     * Generate JWT Token
     * @param payload
     * @param option
     * @returns {*}
     */
    generateToken: function (payload, option) {
        LOG.info('method=generateToken, stage=start');
        const token = jwt.sign(payload, secretKey, option);
        return token;
    },
    /**
     * Setup Passport
     * @returns {*}
     */
    setup: function () {
        LOG.info('method=setup, stage=start');
        passport.use(this.strategy());
        LOG.info('method=setup, stage=end');
        return passport.initialize();
    },
    /**
     * Authenticate user request
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    authenticate: function (req, res, next) {
        const token = this.fromAuthHeaderWithScheme(constants.BEARER_AUTH_SCHEME)();
        return authenticated;
    },
    /**
     *
     * @param auth_scheme
     * @returns {function(*): *}
     */
    fromAuthHeaderWithScheme: function (authScheme) {
        const authSchemeLower = authScheme.toLowerCase();
        return function (request) {
            let token = null;
            if (request.headers[constants.AUTH_HEADER]) {
                const authParams = this.parseAuthHeader(request.headers[constants.AUTH_HEADER]);
                if (authParams && authSchemeLower === authParams.scheme.toLowerCase()) {
                    token = authParams.value;
                }
            }
            return token;
        };
    },
    parseAuthHeader: function(hdrValue) {
        if (typeof hdrValue !== 'string') {
            return null;
        }
        var matches = hdrValue.match(constants.TOKEN_PARSE_REGEX);
        return matches && { scheme: matches[1], value: matches[2] };
    }
};