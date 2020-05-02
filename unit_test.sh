#!/bin/bash
OLDPWD=$(pwd)

cd virtual-iot-device
npm test

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT