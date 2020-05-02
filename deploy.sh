#!/bin/bash

set -e
OLDPWD=$(pwd)


if ! command -v terraform > /dev/null 2>&1
then
    echo "terraform must be installed to deploy the infrastructure"
    exit 1
fi

if ! command -v aws > /dev/null 2>&1
then
    echo "aws cli must be installed to deploy the infrastructure"
    exit 1
fi

cd iac/dev

echo "Deploying terraform..."

terraform init
terraform plan
terraform apply --auto-approve

cd $OLDPWD/serverless-events

echo "Deploying serverless..."

npm install > /dev/null 2>&1
npm run deploy 

echo "Deployment done"

function atexit() { cd "$OLDPWD"; }
trap atexit EXIT