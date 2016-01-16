/* GMnet.GATE
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

/**
 * Configures winston.
 * @exports logger A winston instance
 */

import * as logger from 'winston';
import ConfigManager from './configManager';

logger.setLevels({
    verbose: 4,
    debug: 3,
    info: 2,
    warn: 1,
    error: 0
});
logger.addColors({
    verbose: 'gray',
    debug: 'green',
    info: 'cyan',
    warn: 'yellow',
    error: 'red'
});

logger.remove(logger.transports.Console);

var consoleTransportOptions : logger.ConsoleTransportOptions = {
    level: ConfigManager.get('loglevel'),
    colorize: true
};
logger.add(logger.transports.Console, consoleTransportOptions);

var fileTransportOptions: logger.FileTransportOptions = {
    level: ConfigManager.get('logtofilelevel'),
    filename: ConfigManager.get('logtofile'),
    json: false
};

if (ConfigManager.get('logtofile') && ConfigManager.get('logtofile') != "") {
    logger.add(logger.transports.File, fileTransportOptions);
}

export default logger;
