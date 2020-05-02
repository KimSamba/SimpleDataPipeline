#!/bin/bash

set -e
OLDPWD=$(pwd)

if ! command -v docker-compose > /dev/null 2>&1
then
    echo "docker-compose is not installed. It is required for building this application"
    exit 1
fi

cd virtual-iot-device

echo "Building application..."

docker-compose build

echo "Building complete."

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT