#!/bin/env bash
npm install
npm install tsd
./node_modules/.bin/tsd install
./node_modules/.bin/tsc
if [ ! -f ./config.json ]; then
    cp config.json.example config.json
fi