/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as net from "net";
import * as enums from "../enums";
import ConnectionInstanceInterface from "./connectionInstanceInterface";
import Router from '../router';
import AbstractController from "../controller/abstractController";
import modelManager from "../modelManager";
import logger from '../logger';

/**
 * A single client that is connected via TCP
 */
export default class TcpInstance implements ConnectionInstanceInterface {
    constructor(protected socket: net.Socket) {

    }

    /**
     * Process data send via TCP
     * @param data
     */
    public onData(data : string) {
        logger.log('verbose', 'Tcp: Message from ' + this.socket.remoteAddress + ':' + this.socket.remotePort);
        Router.route(data, this.socket.localAddress, this.socket.localPort, enums.ConnectionType.TCP, this);
    }

    /**
     * Stop the client: Deletes all models registered by this client.
     */
    public stop() {
        modelManager.deleteAllModels(this.socket.localAddress, this.socket.localPort);
    }

    /**
     * Send a message to the client
     * @param response
     * @param controller
     * @param status
     * @param errorMessage
     */
    respond(response: any, controller: AbstractController, status? : enums.ResponseStatus, errorMessage? : string) {
        var self = this;
        Router.prepareResponse(response, controller, function(respondJson) {
            var stringSeparator = String.fromCharCode(enums.GAME_MAKER_STRING_SEPARATOR);
            self.socket.write(respondJson + stringSeparator);
            // TODO Log
        }, status, errorMessage);
    }
}