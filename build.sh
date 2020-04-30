#!/bin/bash
OLDPWD=$(pwd)

cd virtual-iot-device
docker build -t iotdevice .

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT