
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
const constants = require('../../constants/constants');


class ClientError extends Error {
    constructor (status, id, message, developerText) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.id = id;
        this.developerText = developerText;
    }

    statusCode() {
        return this.status
    }
}

module.exports = ClientError;
