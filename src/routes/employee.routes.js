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

const passport = require("passport");
const auth = require('../core/auth.guard');
const employeeController = require('../controllers/employee.controller');


module.exports = function (router) {

    /**
     * Employee list
     */
    router.get('/employee', auth.authenticate(), function(req, res, next) {
        employeeController.getEmployees(req, res);
    });

    /**
     * Get Employee By Id
     */
    router.get('/employee/:id', auth.authenticate(), function(req, res, next) {
        employeeController.getEmployeeById(req, res);
    });
};
