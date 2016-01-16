/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import AbstractModel from "./model/abstractModel";
import logger from './logger';
import * as enums from './enums';
import GateError from "./gateError";

module ModelManager {
    interface ModelCollection {
        [modelClass: string]: AbstractModel;
    }

    var models : ModelCollection[]  = [];

    export function registerModel(modelClassName : string,
                                  remoteAddress : string,
                                  remotePort : number) {
        var n = formatRemote(remoteAddress, remotePort);
        // Delete already existing model
        deleteModel(modelClassName, remoteAddress, remotePort);
        logger.log('verbose', 'Registering Model ' + modelClassName + ' for ' + n);
        if (!models[n]) {
            models[n] = {};
        }
        return createModel(n, modelClassName);
    }

    export function loadModel(modelClassName : string,
                              remoteAddress : string,
                              remotePort : number) {
        var n = formatRemote(remoteAddress, remotePort);
        logger.log('verbose', 'Loading Model ' + modelClassName + ' for ' + n);
        if (!models[n]) {
            models[n] = {};
        }
        if (!models[n][modelClassName]) {
            throw new GateError('ModelManager: Please register ' + modelClassName + ' first.', enums.ResponseStatus.MODEL_NOT_FOUND);
        }
        return models[n][modelClassName];
    }

    export function deleteAllModels(remoteAddress : string,
                                    remotePort : number) {
        var n = formatRemote(remoteAddress, remotePort);
        logger.log('verbose', 'Deleting all Models for ' + n);
        if (models[n]) {
            for (var modelClassName in models[n]) {
                deleteModel(modelClassName, remoteAddress, remotePort);
            }
        } else {
            models[n] = {};
        }
    }

    export function deleteModel(modelClassName : string,
                                remoteAddress : string,
                                remotePort : number) {
        var n = formatRemote(remoteAddress, remotePort);
        logger.log('verbose', 'Deleting Model ' + modelClassName + ' for ' + n);
        if (models[n] && typeof models[n][modelClassName] != 'undefined') {
            models[n][modelClassName].beforeDelete();
            delete models[n][modelClassName];
        }
    }

    export function getSingleton(modelClassName : string) {
        logger.log('verbose', 'Get Singleton Model ' + modelClassName);
        if (!models['singles']) {
            models['singles'] = {};
        }
        if (typeof models['singles'][modelClassName] == 'undefined')  {
            logger.log('verbose', 'Registering Singleton ' + modelClassName);
            createModel('singles', modelClassName);
        }
        return models['singles'][modelClassName];
    }

    function createModel(scope : string, modelClassName : string) {
        try {
            var ModelClass = require('./model/' + modelClassName);
        } catch (e) {
            throw new GateError('ModelManager: Could not find model '+ modelClassName, enums.ResponseStatus.MODEL_CLASS_NOT_FOUND);
        }
        var loadedModel;
        try {
            loadedModel = new ModelClass['default']();
        } catch (e) {
            throw new GateError('ModelManager: Model class could not be loaded, it is invalid: ' + modelClassName, enums.ResponseStatus.MODEL_INVALID);
        }
        if (!(loadedModel instanceof AbstractModel)) {
            throw new GateError('ModelManager: Model class could not be loaded, it is invalid: ' + modelClassName, enums.ResponseStatus.MODEL_INVALID);
        }
        models[scope][modelClassName] = loadedModel;
        return models[scope][modelClassName];
    }

    function formatRemote(remoteAddress : string , remotePort : number) : string {
        return remoteAddress+"::::"+remotePort;
    }
}

export default ModelManager;