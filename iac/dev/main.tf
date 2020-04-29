provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

module "kinesis" {
    source = "../modules/kinesis"
    application = var.application

    shard_count = var.shard_count
    aggregation_interval = var.aggregation_interval

}

module "iot_rule" {
    source = "../modules/iot-to-kinesis"
    application = var.application

    topic_prefix = var.topic_prefix
    kinesis_arn = module.kinesis.stream_input_arn
    kinesis_stream_name = module.kinesis.stream_input_name
}