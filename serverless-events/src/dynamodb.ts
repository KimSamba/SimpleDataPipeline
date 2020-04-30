import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();


interface Record {
    Timestamp: string;
    County: string;
    CountyCount: number;
}

export async function putRecord(record: Record) {
    console.log('Putting record', record);
    await client.put({
        Item: record,
        TableName: process.env.TABLE_NAME
    }).promise();
    console.log('Record', record, 'Complete');
}