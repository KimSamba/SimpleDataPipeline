import {IotData} from 'aws-sdk';
import {RiverData} from './riverData';

interface PublisherParams {
    sensorName: string;
    config: IotData.ClientConfiguration;
}

export class Publisher {
    private iot: IotData;
    private sensorName: string;
    constructor(params: PublisherParams) {
        this.iot = new IotData(params.config);
        this.sensorName = params.sensorName;
    }

    publish(payload: RiverData) {
        return this.iot
            .publish({
                topic: this.sensorName,
                payload: JSON.stringify(payload),
            })
            .promise();
    }
}
