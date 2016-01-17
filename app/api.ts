/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

/**
 * This module contains some specifications for GMnet GATE, such as the
 * information required in requests and responses.
 */

import * as enums from './enums';
import ConnectionInstanceInterface from "./net/connectionInstanceInterface";
import AbstractModel from "./model/abstractModel";

// When changing please also change check in router
interface Request {
    version         : number,       // 1400 TODO
    route           : string,       // "Core"
    requestMethod   : string,       // "methodName"
    modelId         : string|number,// "0"
    requestArgs     : any
}

interface Response {
    version         : number,       // 1400 TODO
    status          : enums.ResponseStatus // SUCCESS
    errorMessage    : string,
    route           : string,       // "Core"
    requestMethod   : string,       // "methodName"
    modelId         : string|number // "0"
    responseArgs    : any
}

interface ConnectionInfo {
    remoteAddress   : string,
    remotePort      : number,
    connectionType  : enums.ConnectionType,
    connectionInstance : ConnectionInstanceInterface
}


export {Request};
export {Response};
export {ConnectionInfo};