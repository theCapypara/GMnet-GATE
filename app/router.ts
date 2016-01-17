/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as enums from './enums';
import ConnectionInstanceInterface from "./net/connectionInstanceInterface";
import Udp from "./net/udp";
import {Response} from "./api";
import {Request} from "./api";
import {ConnectionInfo} from "./api";
import AbstractController from "./controller/abstractController";
import AbstractControllerConstructor from "./controller/abstractController";
import logger from './logger';
import GateError from "./gateError";

class ErrorController extends AbstractController {
}

module Router {
    export function route(jsonData : string,
                          rAddress : string,
                          rPort : number,
                          connectionType : enums.ConnectionType,
                          connectionInstance : ConnectionInstanceInterface) {
        try {
            var data:Request = JSON.parse(jsonData);
            // Test if data is valid
            if (!data.hasOwnProperty("version") ||
                !data.hasOwnProperty("route") ||
                !data.hasOwnProperty("requestMethod") ||
                !data.hasOwnProperty("modelId") ||
                !data.hasOwnProperty("requestArgs")) {
                throw new Error();
            }
        } catch (e) {
            logger.warn('Got invalid request from ' + rAddress + ":" + rPort);
            return;
        }
        // Remove any non-alphabetic characters besides _
        var route = (data.route).replace(/[^_\w]/g, '').toLowerCase();
        var method = data.requestMethod + 'Action';
        var args = data.requestArgs;

        logger.log('verbose', 'Routing ' + jsonData);

        var connectionInfo:ConnectionInfo = {
            remoteAddress: rAddress,
            remotePort: rPort,
            connectionType: connectionType,
            connectionInstance: connectionInstance
        };

        try {
            var Controller;
            try {
                Controller = require('./controller/' + route + '.js');
            } catch (e) {
                throw new GateError('Router: Controller not found', enums.ResponseStatus.CONTROLLER_NOT_FOUND);
            }
            var controller:AbstractController = null;
            try {
                controller = new Controller['default']();
            } catch (e) {
                throw new GateError('Router: Controller could not be loaded: '+ e.message, enums.ResponseStatus.CONTROLLER_INVALID);
            }

            if (controller instanceof AbstractController) {
                // controller found!
                logger.log('verbose', 'Matched Controller ' + route);
                controller.setOriginalRequestData(data);

                if (typeof controller[method] === 'function') {
                    logger.log('verbose', 'Matched method ' + method);
                    // method found!
                    // Check if method starts with letter
                    if (!(/[A-Za-z]/g.test(method.charAt(0)))) {
                        throw new GateError('Router: Invalid method requested', enums.ResponseStatus.INVALID_METHOD);
                    }
                    controller.setConnectionInfo(connectionInfo);
                    if (controller.preDispatch()) {
                        return controller[method](args);
                    }
                    logger.log('verbose', 'The request was rejected by preDispatch');
                    return;
                }
                throw new GateError('Router: Could not match method', enums.ResponseStatus.METHOD_NOT_FOUND);
            }
            throw new GateError('Router: Controller invalid', enums.ResponseStatus.CONTROLLER_INVALID);
        } catch (e) {
            controller = new ErrorController();
            controller.setConnectionInfo(connectionInfo);
            controller.setOriginalRequestData(data);
            var errorCode = enums.ResponseStatus.GENERIC_ERROR;
            if (e.errorCode) {
                errorCode = e.errorCode;
            }
            return connectionInstance.respond({}, controller, errorCode, e.message);

        }
    }
    export function prepareResponse(responseObject: any,
                                    controller: AbstractController,
                                    callback : Function,
                                    status?: enums.ResponseStatus,
                                    errorMessage?: string) {
        if (typeof status === 'undefined') {
            status = enums.ResponseStatus.SUCCESS;
        }
        if (typeof errorMessage === 'undefined') {
            errorMessage = "";
        }
        var requestData : Request = controller.getOriginalRequestData();
        var response : Response = {
            version : enums.VERSION_MAYOR,
            status : status,
            errorMessage  : errorMessage,
            route : requestData.route,
            requestMethod : requestData.requestMethod,
            modelId : requestData.modelId,
            responseArgs : responseObject
        };
        callback(JSON.stringify(response));
    }
}
export default Router;