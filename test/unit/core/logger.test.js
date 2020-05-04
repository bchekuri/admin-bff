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

require('../globalconfig.test');

const sinon = require('sinon');
const log4js = require('log4js');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const config = require('config');
const logger = require('../../../src/core/logger');

const { expect } = chai;
chai.use(sinonChai);

describe('Test application logger', () => {
    let sandbox;
    let ensureDirSyncStub;
    let createLoggerStub;
    let testLogger;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        testLogger = {
            log : 'testAppLogger'
        };
        createLoggerStub = sandbox.stub(bunyan, `createLogger`).callsFake(() => testLogger);
        ensureDirSyncStub = sandbox.stub(config, `get`);
    });

    afterEach(() => {
        sandbox.restore();
        logger.log = null;
    });

    describe(`when init() method is called`, () => {
        let actualLogger;
        describe(`when logger is not initialized`, () => {
            actualLogger = logger.init();
            it(`then logger is returned`, () => {
                expect(testLogger).to.be.an(actualLogger);
            });
        });

        describe(`when logger is already initialized`, () => {
            logger.log = testLogger;
            let sameLogger = logger.init();
            it(`then the same logger is returned`, () => {
                expect(testLogger).to.equal(sameLogger);
            });
        });
    });
});

