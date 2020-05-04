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
const path = require('path');
const config = require('./config');

const applicationName = config.get(`app.name`, `testApp`);
const defaultLogPattern = '[%d] [%p] [%h] [appName=%x{appName}] [%c] %m';

/**
 * Default Logger Layout
 * @type {Readonly<{type: string, pattern: string, tokens: {appName: *}}>}
 */
const defaultLayout = Object.freeze({
    type: 'pattern',
    pattern: defaultLogPattern,
    tokens: {
        appName: applicationName
    }
});

/**
 * Default Log4j Config
 * @type {Readonly<{appenders: {console: {type: string, layout: {}}, consoleAccess: {type: string, layout: {}}, app: {type: string, filename: string, maxLogSize: number, numBackups: number, layout: {}}, access: {type: string, pattern: string, filename: string, category: string, layout: {}}}, categories: {default: {appenders: string[], level: string}, http: {appenders: string[], level: string}}}>}
 */
const defaultLog4jsConfig = Object.freeze({
    appenders: {
        console: {
            type: "stdout",
            layout: {...defaultLayout}
        },
        consoleAccess: {
            type: "stdout",
            layout: {...defaultLayout}
        },
        app: {
            type: "file",
            filename: path.join(`${process.cwd()}`, `log`, `app.log`),
            maxLogSize: 10485760,
            numBackups: 3,
            layout: {...defaultLayout}
        },
        access: {
            type: "dateFile",
            pattern: "-yyyy-MM-dd",
            filename: path.join(`${process.cwd()}`, `log`, `access.log`),
            category: "http",
            layout: {...defaultLayout}
        }
    },
    categories: {
        default: { appenders: [ "console" ], level: "DEBUG" },
        http: { appenders: [ "consoleAccess" ], level: "DEBUG" }
    }
});

/**
 * Default Options
 * @type {Readonly<{noStdOut: boolean, rotateLogFile: boolean}>}
 */
const defaultOptions = Object.freeze({
    noStdOut : false,
    rotateLogFile: false
});

module.exports = {
    /**
     * Configure application logs
     * @returns {{}}
     */
    configureLog4js: () => {
        let options = config.get(`logger.app.options`, defaultOptions);
        let log4jsConfig = {...defaultLog4jsConfig};
        const noStdOut = options.noStdOut || true;
        const level = options.level || `DEBUG`;
        const format = options.format || defaultLogPattern;
        log4jsConfig.categories.default.level = level;
        log4jsConfig.appenders.console.layout.pattern = format;
        if(!noStdOut) {
            delete log4jsConfig.appenders.console;
        }
        const rotateLogFile = options.rotateLogFile || false;
        if(rotateLogFile) {
            const logDir = options.logDir || path.join(`${process.cwd()}`, `log`);
            const logFileName = options.logName || `app.log`;
            log4jsConfig.appenders.app.filename = path.join(logDir, logFileName);
            log4jsConfig.appenders.app.layout.pattern = format;
            log4jsConfig.categories.default.appenders.push(`app`);
        } else {
            delete log4jsConfig.appenders.app;
        }
        let middlewareOptions = config.get(`logger.access.options`, defaultOptions);
        const middlewareLevel = middlewareOptions.level || `DEBUG`;
        const middlewareLayoutFormat = middlewareOptions.format || defaultLogPattern;
        log4jsConfig.categories.http.level = middlewareLevel;
        log4jsConfig.appenders.consoleAccess.layout.pattern = middlewareLayoutFormat;
        const middlewareNoStdOut = middlewareOptions.noStdOut || true;
        if(!middlewareNoStdOut) {
            delete log4jsConfig.appenders.console;
        }
        const middlewareRotateLogFile = middlewareOptions.rotateLogFile || false;
        if(middlewareRotateLogFile) {
            const middlewareLogDir = middlewareOptions.logDir || path.join(`${process.cwd()}`, `log`);
            const middlewareLogFileName = middlewareOptions.logName || `access.log`;
            log4jsConfig.appenders.access.filename = path.join(middlewareLogDir, middlewareLogFileName);
            log4jsConfig.appenders.access.layout.pattern = middlewareLayoutFormat;
            log4jsConfig.categories.http.appenders.push(`access`);
        } else {
            delete log4jsConfig.appenders.access;
        }
        log4js.configure(log4jsConfig);
        return log4jsConfig;
    }
};
