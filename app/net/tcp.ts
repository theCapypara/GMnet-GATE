/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as net from "net";
import TcpInstance from "./tcpInstance";
import logger from '../logger';

/**
 * The TCP listening server.
 */
export default class Tcp {
    protected server: net.Server;
    protected clients: TcpInstance[] = [];

    constructor(public port: number) {
    }

    /**
     * Starts the TCP server/interface
     */
    public start() {
        logger.debug('Starting Tcp interface.');
        this.server = net.createServer(this.proccessNewConnection).listen(this.port);
    }

    /**
     * Stops the TCP interface and tells all connected TcpInstances to run their stop logic.
     */
    public stop() {
        logger.debug('Stopping Tcp interface.');
        for (var i = 0; i < this.clients.length ; i++) {
            this.clients[i].stop();
        }
        this.server.close();
        this.clients = [];
        this.port = null;
    }

    /**
     * Process the connection of a new player.
     * This will create a new TcpInstance.
     * @param socket
     */
    protected proccessNewConnection(socket: net.Socket) {
        logger.debug('Tcp: New connection from ' + socket.remoteAddress + ':' + socket.remotePort);
        var self = this;

        var client = new TcpInstance(socket);
        this.clients.push(client);

        // Attach events
        socket.on('data', function (data: string) {
            client.onData(data);
        });
        socket.on('end', function () {
            client.stop();
            self.clients.splice(self.clients.indexOf(client), 1);
        });

    }
}