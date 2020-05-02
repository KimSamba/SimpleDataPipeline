variable "shard_count" {
    description = "Number of shared to use in the kinesis stream"
    type = number
    default = 1
}

variable "topic_prefix" {
    description = "Topic prefix the rule will should subscribe to"
    type = string
}

variable "application" {
    type = string
}

variable "aggregation_interval" {
    type = number
    description = "Interval to aggregate the last data in minutes"
}