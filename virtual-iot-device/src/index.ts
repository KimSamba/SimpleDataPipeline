// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {promises} from 'fs';
import {downloadCsv} from './csvLoader';
import {createStreamFromDataset} from './stream';
import {preprocessData, RiverDataRaw} from './riverData';
import {Publisher} from './emitter';
import {Iot} from 'aws-sdk';

async function start() {
    const rawConfig = await promises.readFile('./src/config.json');
    const config = JSON.parse(rawConfig.toString());
    let endpointAddress = config.iotEndpoint;

    if (!endpointAddress) {
        const iot = new Iot({
            region: config.region,
        });
        ({endpointAddress} = await iot
            .describeEndpoint({
                endpointType: 'iot:Data-ATS',
            })
            .promise());
    }

    const dataset: RiverDataRaw[] = await downloadCsv(config.dataSetUrl);
    const stream$ = createStreamFromDataset({
        dataset: dataset.map(preprocessData),
        frequency_hz: config.dataEmissionFrequency_hz,
        repeat: config.repeat,
    });
    const publisher = new Publisher({
        config: {
            endpoint: endpointAddress,
            region: config.region,
        },
        sensorName: config.sensorName,
    });
    stream$.subscribe(data => {
        console.log(data);
        publisher.publish(data);
    });
}

start();
