#!/bin/bash

set -e
OLDPWD=$(pwd)

if ! command -v npm > /dev/null 2>&1
then
    echo "npm must be installed for running unit tests."
    exit 1
fi


cd virtual-iot-device

echo "Running tests..."

npm test

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT