#!/bin/env node

/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */
require('fs').stat(__dirname+'/build/GMnetGate.js', function(err, stat) {
    if (err != null || !stat.isFile()) {
        console.log('Please build GMnet GATE first. See instructions at https://github.com/Parakoopa/GMnet-PUNCH or run ./build.sh .');
        process.exit(1);
    }
    require('./build/GMnetGate');
});