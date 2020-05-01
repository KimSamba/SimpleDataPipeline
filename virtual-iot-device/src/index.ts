import config from './config';
import {downloadCsv} from './csvLoader';
import {createStreamFromDataset} from './stream';
import {preprocessData, RiverDataRaw} from './riverData';
import {Publisher} from './emitter';
import {Iot} from 'aws-sdk';

async function start() {
    let endpointAddress = config.iotEndpoint;

    if (!endpointAddress) {
        const iot = new Iot({
            region: process.env.AWS_DEFAULT_REGION || config.region,
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
    });
    const publisher = new Publisher({
        config: {
            endpoint: endpointAddress,
            region: process.env.AWS_DEFAULT_REGION || config.region,
        },
        sensorName: config.sensorName || 'N/A',
    });
    stream$.subscribe(data => {
        console.log(data);
        publisher.publish(data);
    });
}

start();

process.on('SIGINT', () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
});
