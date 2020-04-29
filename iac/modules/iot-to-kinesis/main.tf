resource "aws_iot_topic_rule" "rule" {
  name        = "IotDataToKinesis"
  description = "Pipe IoT Data to kinesis data stream"
  enabled     = true
  sql         = "SELECT * FROM '${var.topic_prefix}/+'"
  sql_version = "2015-10-08"

  kinesis {
    role_arn    = aws_iam_role.iot_role_for_kinesis.arn
    stream_name = var.kinesis_stream_name
  }

}

resource "aws_iam_role" "iot_role_for_kinesis" {
  name = "IotToKinesisRole"

  tags = {
    Application = var.application
  }

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "iot.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "policy" {
  name = "${var.application}_IotAccessKinesis"

  role   = aws_iam_role.iot_role_for_kinesis.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "kinesis:*"
      ],
      "Effect": "Allow",
      "Resource": "${var.kinesis_arn}"
    }
  ]
}
EOF
}
