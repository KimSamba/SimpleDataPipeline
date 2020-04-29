variable "topic_prefix" {
    description = "Topic prefix the rule will should subscribe to"
    type = string
}

variable "kinesis_arn" {
    description = "Arn of the kinesis stream"
    type = string
}

variable "kinesis_stream_name" {
    type = string
}

variable "application" {
    type = string
}