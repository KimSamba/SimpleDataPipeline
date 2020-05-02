#!/bin/bash

set -e

if ! command -v docker-compose > /dev/null 2>&1
then
    echo "docker-compose is not installed. It is required for running this application"
    exit 1
fi

INI_FILE=~/.aws/credentials

while IFS=' = ' read key value
do
    if [[ $key == \[*] ]]; then
        section=$key
    elif [[ $value ]] && [[ $section == '[default]' ]]; then
        if [[ $key == 'aws_access_key_id' ]]; then
            export AWS_ACCESS_KEY_ID=$value
        elif [[ $key == 'aws_secret_access_key' ]]; then
            export AWS_SECRET_ACCESS_KEY=$value
        fi
    fi
done < $INI_FILE

docker-compose up
