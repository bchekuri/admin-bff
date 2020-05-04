
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

const config = require('config');

/**
 * Get config value, if config value not present it will return default value provided,
 * if default value is not provided then it will return null.
 * @param key
 * @param defaultValue
 */
function get(key, defaultValue = null){
    if(key !== null && typeof (key) === 'string') {
        if(config.has(key)) {
            let val = config.get(key);
            if(typeof val === 'string') {
                return val || defaultValue;
            }
            return val
        } else {
            return defaultValue;
        }
    } else {
        throw Error("key can't be null!");
    }
}

module.exports = {
    get
};