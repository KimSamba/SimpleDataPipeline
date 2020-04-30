import { KinesisStreamEvent } from 'aws-lambda';
import 'source-map-support/register';
import { putRecord } from './dynamodb';

export const saveAggregateData = async (event: KinesisStreamEvent) => {
  return Promise.allSettled(
    event.Records
      .map((x) => {
        try {
          console.log(x);
          return JSON.parse(Buffer.from(x.kinesis.data, 'base64').toString('utf8'))
        } catch {
          return null;
        }
      })
      .filter(x => !!x)
      .map((x) => putRecord(x))
  );
}
