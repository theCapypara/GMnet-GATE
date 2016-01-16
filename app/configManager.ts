/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as commander from 'commander';
import * as enums from './enums';
import {EOL} from 'os';

/**
 * Manager for configuration settings
 */
module ConfigManager {
    var config : any = {};

    /**
     * Loads configuration from config.json.
     * After that creates command line arguments and parses them into the
     * configuration.
     */
    export function init() {
        config = require('../config');

        // Command line arguments
        commander
            .description('GMnet GATE' + EOL +
            '  The master server for GMnet PUNCH / GMnet ENGINE'  + EOL +
            '  More information: https://gmnet-engine.org' + EOL +
            '  All options below can also be changed in the config.json')
            .version(enums.VERSION)
            .option('-p, --port [PORT]', 'Port to listen on')
            .option('-n, --name [NAME]', 'Name of the master server')
            .option('-l, --loglevel [LEVEL]', 'Change the log level on the console. Supported: verbose, info, warn, error')
            .option('-f, --logtofile [FILE]', 'Log to file')
            .option('--logtofilelevel [LEVEL]', 'Log level for file logging. See --loglevel')
            .parse(process.argv);
        var options = commander.opts();
        for (var option in options) {
            if (options.hasOwnProperty(option) && typeof options[option] != 'undefined' && typeof options[option] != 'function') {
                config[option] = options[option];
            }
        }

    }

    /**
     * Get a value from the configuration storage.
     * @param key
     * @returns {*}
     */
    export function get(key : string) : any {
        return config[key];
    }
}
export default ConfigManager;