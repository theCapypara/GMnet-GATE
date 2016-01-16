/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import {ConnectionInfo} from "../api";
import {Request} from "../api";
import * as enums from "../enums";
import AbstractModel from "../model/abstractModel";
import AbstractController from "./abstractController";
import GateError from "../gateError";
import modelManager from "../modelManager";
import logger from '../logger';

/**
 * If you extend this version of the controller, your controller
 * has to be registered first with the 'register' method.
 * This will create a new instance of the model specified by getModelName
 * and you can use the data in this model across different requests of the client.
 */
abstract class AbstractRegisterableController extends AbstractController {
    protected registeredModel: any; // Any subclass of AbstractModel TODO: Can this be specified better?

    /**
     * Return the name of the model to use (file name without extension).
     * @returns string
     */
    abstract getModelName() : string;

    setRegisteredModel(model : any) : void {
        this.registeredModel = model;
    }

    /**
     * Returns the model instance to use with this controller
     * @returns A subclass of AbstractModel
     */
    getRegisteredModel() : any {
        return this.registeredModel;
    }

    /**
     * Checks if the model has been previously registered, if yes
     * request will be dispatched, otherwise an error message will be sent.
     */
    preDispatch() {
        // Load model - this will throw an error if the model is missing and prevent dispatch
        var modelClassName = this.getModelName();
        var connectionInfo = this.getConnectionInfo();

        if (this.getOriginalRequestData().requestMethod == 'register') {
            return true;
        }

        try {
            var model = modelManager.loadModel(modelClassName, connectionInfo.remoteAddress, connectionInfo.remotePort);
            if (!model || !(model instanceof AbstractModel)) {
                throw new GateError('Model does not exist', enums.ResponseStatus.MODEL_NOT_FOUND);
            }
        } catch (e) {
            if (!e.errorCode) {
                e.errorCode = enums.ResponseStatus.GENERIC_ERROR;
            }
            this.respond({}, e.errorCode, e.message);
            return false;
        }
        this.setRegisteredModel(model);
        return true;
    }

    /**
     * Registers a new model for this controller.
     */
    registerAction() {
        var modelClassName = this.getModelName();
        var connectionInfo = this.getConnectionInfo();
        try {
            if (connectionInfo.connectionType != enums.ConnectionType.TCP) {
                throw new GateError('Models can only be registered via TCP.', enums.ResponseStatus.MODEL_REGISTRATION_OVER_UDP);
            }
            logger.log('verbose', 'Matched registration');
            if (modelClassName == '') {
                throw new GateError('Router: Controller can\'t be registered', enums.ResponseStatus.NO_MODEL_FOR_CONTROLLER);
            }
            // Register model instance
            var model = modelManager.registerModel(modelClassName, connectionInfo.remoteAddress, connectionInfo.remotePort);
            if (!model) {
                throw new GateError('Router: Model could not be registered', enums.ResponseStatus.MODEL_ERROR);
            }
            this.respond('ok'); //TODO
        } catch (e) {
            if (!e.errorCode) {
                e.errorCode = enums.ResponseStatus.GENERIC_ERROR;
            }
            this.respond({}, e.errorCode, e.message);
        }
    }
}
export default AbstractRegisterableController;
