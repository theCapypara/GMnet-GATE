/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as enums from "../enums";
import ConnectionInstanceInterface from "./connectionInstanceInterface";
import Router from '../router';
import AbstractController from "../controller/abstractController";
import modelManager from "../modelManager";
import logger from '../logger';
import * as readline from 'readline';

/**
 * Debugging interface that can be used to interactively debug GMnet GATE.
 * It can send messages and pretend to be a TCP-connected client.
 */
export default class DebugNet implements ConnectionInstanceInterface {
    constructor() {
    }

    public start() {
        var self = this;
        logger.debug('Starting DebugNet interface.');
        var repl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        repl.on('line', function (cmd) {
            var words = cmd.split(" ");
            var cmd = words.shift();
            switch (cmd) {
                case 'send':
                    Router.route(words.join(" "), 'debug', 0, enums.ConnectionType.TCP, self);
                    break;
                case 'models':
                    console.log(require('util').inspect(modelManager.debugGetModels(), {
                        'depth' : 3,
                        colors: true
                    }));
                    break;
                case 'exit':
                case 'quit':
                    process.exit(0);
                    break;
                default:
                    console.log('Unknown command ' + cmd );
            }
        });
        repl.prompt();
    }

    public stop() {
        logger.debug('Starting DebugNet interface.');
        modelManager.deleteAllModels(modelManager.ftaregt('debug', 0));
    }

    public respond(response: any, controller: AbstractController, status? : enums.ResponseStatus, errorMessage? : string) {
        var connectionInfo = controller.getConnectionInfo();
        Router.prepareResponse(response, controller, function(respondJson) {
            var statusCode = 'ANSWER';
            if (status > 0) {
                statusCode = 'ERROR';
            }
            console.log(statusCode + ': ' + JSON.stringify(JSON.parse(respondJson), null, 2));
        }, status, errorMessage);
    }
}