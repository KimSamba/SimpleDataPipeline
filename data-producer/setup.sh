#!/bin/sh

CERT_ARN=$(aws iot create-keys-and-certificate \
    --set-as-active \
    --certificate-pem-outfile cert.crt \
    --public-key-outfile key.pub \
    --private-key-outfile key.pem \
    --query certificateArn \
    --output text)

aws iot create-policy --policy-name allRights \
    --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"iot:*","Resource":"*"}]}'

aws iot attach-policy --policy-name allRights \
    --target ${CERT_ARN}
curl https://www.amazontrust.com/repository/AmazonRootCA1.pem > AmazonRootCA1.pem

echo "IOT_ENDPOINT=`aws iot describe-endpoint --endpoint-type iot:Data-ATS --output text`" > .env