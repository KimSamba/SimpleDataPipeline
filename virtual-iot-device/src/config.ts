export default {
    dataSetUrl:
        process.env.DATA_SET_URL ||
        'https://query.data.world/s/azf67yuslxfmttps3f2sfrm3t4x4ya',
    dataEmissionFrequency_hz:
        Number(process.env.DATA_EMISSION_FREQUENCY_HZ) || 100,
    sensorName: process.env.SENSOR_NAME,
    region: process.env.AWS_REGION || 'us-east-1',
    iotEndpoint: process.env.IOT_ENDPOINT,
};
