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
const chai = require('chai');
const sinonChai = require('sinon-chai');
const config = require('config');
const appConfig = require('../../../src/core/config');

const { expect } = chai;
chai.use(sinonChai);

describe('Test config', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

    });

    afterEach(() => {
        sandbox.restore()
    });

    describe(`when get method is called`, () => {
        describe(`with key has value`, () => {
            beforeEach(() => {
                sandbox.stub(config, `has`).callsFake(() => true);
                sandbox.stub(config, `get`).callsFake(() => "foo");
            });
            it(`return key value`, () => {
                expect(appConfig.get(`fooKey`)).to.equal('foo');
            });
        });

        describe(`with key has no value and default value`, () => {
            beforeEach(() => {
                sandbox.stub(config, `has`).callsFake(() => false);
            });
            it(`return default value`, () => {
                expect(appConfig.get(`fooKey`, `foo1`)).to.equal('foo1');
            });
        });

        describe(`with key has no value and no default value`, () => {
            beforeEach(() => {
                sandbox.stub(config, `has`).callsFake(() => false);
            });
            it(`return null value`, () => {
                expect(appConfig.get(`fooKey`)).to.be.null
            });
        });

        describe(`with null key`, () => {
            it(`return null value`, () => {
                try {
                    appConfig.get();
                } catch (e) {
                    expect(e.toString()).to.equal('Error: key can\'t be null!');
                }
            });
        });

    });
});

