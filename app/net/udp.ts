/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as dgram from "dgram";
import * as enums from "../enums";
import ConnectionInstanceInterface from "./connectionInstanceInterface";
import Router from '../router';
import AbstractController from "../controller/abstractController";
import logger from '../logger';

/**
 * UDP server
 */
export default class Udp implements ConnectionInstanceInterface {
    protected server: dgram.Socket;
    constructor(public port: number) {

    }

    /**
     * Start UDP server/interface
     */
    public start() {
        logger.debug('Starting Udp interface.');
        this.server = dgram.createSocket('udp4');
        this.server.on('listening', function () {
            // TODO Debugging
        });
        this.server.on('message', this.receiveMessage);

        this.server.bind(this.port);
    }

    /**
     * Stop UDP server
     */
    public stop() {
        logger.debug('Stopping Udp interface.');
        this.server.close();
        this.port = null;
    }

    /**
     * Respond to messages over UDP
     * @param response
     * @param controller
     * @param status
     * @param errorMessage
     */
    public respond(response: any, controller: AbstractController, status? : enums.ResponseStatus, errorMessage? : string) {
        var connectionInfo = controller.getConnectionInfo();
        Router.prepareResponse(response, controller, function(respondJson) {
            // Please note that by design the connected server and/or client is generally not
            // supposed to receive messages via UDP because it will most likely fail to due NATs.
            // Because of this we log a warning here.
            // TODO: Log warning
            var stringSeparator = String.fromCharCode(enums.GAME_MAKER_STRING_SEPARATOR);
            var message = respondJson + stringSeparator;

            this.server.send(message, 0, message.length, connectionInfo.remotePort, connectionInfo.remoteAddress, function(err, bytes) {
                if (err) throw err; //TODO
                // TODO Log
            }, status, errorMessage);
        });
    }

    /**
     * Processing incoming messages via UDP
     * @param data
     * @param remote
     */
    protected receiveMessage(data : string, remote : {port : number; address: string}) {
        logger.log('verbose', 'Udp: Message from ' + remote.address + ':' + remote.port);
        Router.route(data, remote.address, remote.port, enums.ConnectionType.UDP, this);
    }
}