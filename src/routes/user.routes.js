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

const userController = require('../controllers/user.controller');

/**
 * User Route
 * @param router
 */
module.exports = function (router) {

    /**
     * Health Method
     */
    router.post('/login', (req, res, next) => {
        userController.login(req, res);
    });
};