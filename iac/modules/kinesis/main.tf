resource "aws_kinesis_stream" "stream_input" {
  name        = "${var.application}_input"
  shard_count = var.shard_count

  tags = {
    Application = var.application
  }
}

resource "aws_kinesis_stream" "stream_output" {
  name        = "${var.application}_output"
  shard_count = var.shard_count

  tags = {
    Application = var.application
  }
}

resource "aws_iam_role" "kinesis_analytics_role" {
  name = "KinesisAnalyticsRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "kinesisanalytics.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF

  tags = {
    Application = var.application
  }
}

resource "aws_iam_role_policy" "policy" {
  name = "${var.application}_KinesisAccessKinesis"

  role   = aws_iam_role.kinesis_analytics_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "kinesis:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_kinesis_stream.stream_input.arn}",
        "${aws_kinesis_stream.stream_output.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_kinesis_analytics_application" "app" {
  name = var.application
  tags = {
    Application = var.application
  }

  code = <<EOF
CREATE OR REPLACE STREAM "${var.application}_output" (
    county           VARCHAR(64), 
    county_count     INTEGER);

CREATE OR REPLACE PUMP "STREAM_PUMP" AS 
  INSERT INTO "${var.application}_output" 
    SELECT STREAM 
        "County" as county,
        COUNT("County") AS county_count
    FROM "${var.application}_001"
    GROUP BY "County", STEP("${var.application}_001".ROWTIME BY INTERVAL '${var.aggregation_interval}' SECOND);
      
EOF

  inputs {
    name_prefix = var.application

    parallelism {
      count = 1
    }
    schema {
      record_columns {
        mapping  = "$.County"
        name     = "County"
        sql_type = "VARCHAR(50)"
      }

      record_encoding = "UTF-8"

      record_format {
        mapping_parameters {
          json {
            record_row_path = "$"
          }
        }
      }

    }

    kinesis_stream {
      resource_arn = aws_kinesis_stream.stream_input.arn
      role_arn     = aws_iam_role.kinesis_analytics_role.arn
    }
  }

  outputs {
    name = "${var.application}_output"

    schema {
      record_format_type = "JSON"

    }

    kinesis_stream {
      resource_arn = aws_kinesis_stream.stream_output.arn
      role_arn     = aws_iam_role.kinesis_analytics_role.arn
    }
  }
}

resource "aws_ssm_parameter" "stream_output_arn" {
  name  = "stream-output-arn"
  type  = "String"
  value = aws_kinesis_stream.stream_output.arn
}

resource "null_resource" "start_application" {
  provisioner "local-exec" {
    command = "aws kinesisanalytics start-application --application-name ${aws_kinesis_analytics_application.app.name} --input-configurations Id=string,InputStartingPositionConfiguration={InputStartingPosition=NOW}"
  }
}