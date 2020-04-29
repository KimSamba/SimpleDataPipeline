// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {promises} from 'fs';
import {downloadCsv} from './csvLoader';
import {createStreamFromDataset} from './stream';
import {preprocessData, RiverDataRaw} from './riverData';
import {Publisher} from './emitter';

async function start() {
    const rawConfig = await promises.readFile('./src/config.json');
    const config = JSON.parse(rawConfig.toString());
    const dataset: RiverDataRaw[] = await downloadCsv(config.dataSetUrl);
    const stream$ = createStreamFromDataset({
        dataset: dataset.map(preprocessData),
        frequency_hz: config.dataEmissionFrequency_hz,
        repeat: config.repeat,
    });
    const publisher = new Publisher({
        config: config.iotConfig,
        sensorName: config.sensorName,
    });
    stream$.subscribe(data => {
        publisher.publish(data);
    });
}

start();
