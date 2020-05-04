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

const LOG = require('log4js').getLogger('employee.controller');

const EMPLOYEE_LIST = Object.freeze([{"id" : "1", "name" : "Node"},
    {"id" : "2", "name" : "Express"},
    {"id" : "3", "name" : "King"}]);

function getEmployees(req, res) {
    LOG.info(`getEmployees start`);
    res.send(EMPLOYEE_LIST);
    LOG.info(`getEmployees end`);
}

function getEmployeeById(req, res) {
    LOG.info(`Id - ${req.params.id}`);
    let results = EMPLOYEE_LIST.find((employee) => {
       return  req.params.id && employee.id === req.params.id;
    });
    res.send(results);
}


module.exports = {
    getEmployees,
    getEmployeeById
}