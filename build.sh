#!/bin/bash
OLDPWD=$(pwd)

cd virtual-iot-device
docker-compose build

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT