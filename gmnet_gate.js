#!/bin/env node
require('fs').stat(__dirname+'/build/gmnet_gate.js', function(err, stat) {
    if (err != null || !stat.isFile()) {
        console.log('Please build GMnet GATE first. See instructions at https://github.com/Parakoopa/GMnet-PUNCH or run ./build.sh .');
        process.exit(1);
    }
    require('./build/gmnet_gate');
});