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
        [targetNid: string]: AbstractModel;
    }

    /**
     * models = {
     *   "modelclass" = {  // eg. "server"
     *      "target" = {
     *        "id" = AbstractModel
     *      }
     *    }
     * }
     */
    var models : ModelCollection[]  = [];

    export function registerModel(modelClassName : string,
                                  target: string,
                                  modelId : string) {
        // Delete already existing model
        deleteModel(modelClassName, target, modelId);
        logger.log('verbose', 'Registering Model ' + modelId + ' ' + modelClassName + ' for ' + target);
        if (!models[modelClassName]) {
            models[modelClassName] = {};
        }
        return createModel(modelClassName, target, modelId);
    }

    export function loadModel(modelClassName : string,
                              target: string,
                              modelId : string) {
        logger.log('verbose', 'Loading Model ' + modelId + ' ' + modelClassName + ' for ' + target);
        if (!models[modelClassName]) {
            models[modelClassName] = {};
        }
        if (!models[modelClassName][target]) {
            models[modelClassName][target] = {};
        }
        if (!models[modelClassName][target][modelId]) {
            throw new GateError('ModelManager: Please register ' + modelClassName + ' first.', enums.ResponseStatus.MODEL_NOT_FOUND);
        }
        return models[modelClassName][target][modelId];
    }

    export function deleteAllModels(target : string) {
        logger.log('verbose', 'Deleting all Models for ' + target);
        for (var modelClassName in models) {
            if (models[modelClassName][target]) {
                for (var modelId in models[modelClassName][target]) {
                    deleteModel(modelClassName, target, modelId);
                }
            }
        }
    }

    export function deleteModel(modelClassName : string,
                                target: string,
                                modelId : string) {
        logger.log('verbose', 'Deleting Model ' + modelId + ' ' + modelClassName + ' for ' + modelId);
        if (models[modelClassName] && typeof models[modelClassName][target] == 'object' && typeof models[modelClassName][target][modelId] == 'object') {
            models[modelClassName][target][modelId].beforeDelete();
            delete models[modelClassName][target][modelId];
        }
    }

    export function getSingleton(modelClassName : string) {
        logger.log('verbose', 'Get Singleton Model ' + modelClassName);
        if (!models[modelClassName]) {
            models[modelClassName] = {};
        }
        if (typeof models[modelClassName]['single'] == 'undefined' || typeof models[modelClassName]['single']["0"] == 'undefined')  {
            logger.log('verbose', 'Registering Singleton ' + modelClassName);
            createModel(modelClassName, 'singles', "0");
        }
        return models[modelClassName]['single'][0];
    }

    function modelCount(modelClassName, target) {
        if (models[modelClassName]) {
            if (models[modelClassName][target]) {
                // XXX: Should probably implement internal count since this method causes memory overhead:
                console.log('XXXXXXXXXXXXXXX'+Object.keys(models[modelClassName][target]).length);
                return Object.keys(models[modelClassName][target]).length;
            }
        }
        return 0;
    }

    function createModel(modelClassName : string, target : string, modelId : string) {
        try {
            var ModelClass = require('./model/' + modelClassName);
        } catch (e) {
            throw new GateError('ModelManager: Could not find model '+ modelClassName, enums.ResponseStatus.MODEL_CLASS_NOT_FOUND);
        }
        console.log("YYYYYYYYYYYYY"+ModelClass['default'].maximumInstances);
        if (modelCount(modelClassName, target) >= ModelClass['default'].maximumInstances) {
            deleteAllModels(target);
            logger.log('info', 'Deleted all ' + modelClassName + ' models for ' + target + ' because client exceeded maximum number of these.');
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
        if (!models[modelClassName]) {
            models[modelClassName] = {};
        }
        if (!models[modelClassName][target]) {
            models[modelClassName][target] = {};
        }
        models[modelClassName][target][modelId] = loadedModel;
        return models[modelClassName][target][modelId];
    }

    export function ftaregt(remoteAddress : string , remotePort : number) : string {
        return remoteAddress+"::::"+remotePort;
    }

    export function debugGetModels() {
        return models;
    }
}

export default ModelManager;