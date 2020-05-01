#!/bin/bash
OLDPWD=$(pwd)

cd iac/dev

terraform init
terraform plan
terraform apply --auto-approve

cd $OLDPWD/serverless-events

npm install
npm run deploy

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT