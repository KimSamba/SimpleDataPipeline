variable "shard_count" {
    type = number
    default = 1
}

variable "aggregation_interval" {
    type = number
    description = "Interval to aggregate the last data in minutes"
}

variable "application" {
    type = string
}