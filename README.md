# SimpleDataPipeline

This application emulate sending of IoT data from Recommended-Fishing-Rivers-And-Streams dataset:
https://data.world/data-ny-gov/jcxg-7gnm/workspace/file?filename=recommended-fishing-rivers-and-streams-1.csv

The data is ingested by a stream pipeline, which then create an aggregate of the sum of records from the same County, at 5 minutes interval.
It will then save the aggregation to a database.

## System Overview

![Diagram](docs/diagram.png)

1. Simulation of an IoT sensor emitting MQTT data (NodeJS app)
2. IoT rule is triggered and push the data to Kinesis Data Stream
3. Kinesis Data Analytics application calcultes the aggregates from the input stream, and outputs it to another stream
4. AWS Lambda will pull data from the output stream and save it to DynamoDB

### Virtual IoT Device

The virtual IoT device will do the following:

1. Download data from the data set
2. Preprocess the data (remove spaces in keys and transform into JSON)
3. Send indefinitely the data at given frequency, in random order

Must set the configuration in [config.json](./virtual-iot-device/src/config.json)

```json
{
    "dataSetUrl": "https://query.data.world/s/azf67yuslxfmttps3f2sfrm3t4x4ya",
    "dataEmissionFrequency_hz": 10,
    "repeat": true,
    "sensorName": "SensorA",
    "region": "us-east-1",
    "iotEndpoint": ""
}
```