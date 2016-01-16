/* GMnet PUNCH
 * Licensed under the MIT license. 
 * Please see the LICENSE file for more information.
 */

/**
 * Entry point for GMnet GATE :)
 * Loads all configurations, setups logging and starts networking servers.
 */

import ConfigManager from './configManager';
ConfigManager.init();

import Tcp from './net/tcp';
import Udp from './net/udp';
import DebugNet from './net/debugNet';
import logger from './logger';

logger.info('GMnet GATE starting on port '+ConfigManager.get('port'));

var tcp = new Tcp(ConfigManager.get('port'));
tcp.start();
var udp = new Udp(ConfigManager.get('port'));
udp.start();

if (ConfigManager.get('debuuging_interface') === true) {
    var debug = new DebugNet();
    debug.start();
}