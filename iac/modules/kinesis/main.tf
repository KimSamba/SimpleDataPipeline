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
    "Timestamp"   TIMESTAMP,
    "County"          VARCHAR(64),
    "CountyCount"     INTEGER);

CREATE OR REPLACE PUMP "STREAM_PUMP" AS 
  INSERT INTO "${var.application}_output" 
    SELECT STREAM 
        FLOOR("COL_Timestamp" TO MINUTE) as "Timestamp",
        "County",
        COUNT("County") AS "CountyCount"
    FROM "${var.application}_001"
    WINDOWED BY STAGGER (
            PARTITION BY FLOOR("COL_Timestamp" TO MINUTE), "County" RANGE INTERVAL '${var.aggregation_interval}' SECOND);
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
        sql_type = "VARCHAR(16)"
      }

      record_columns {
        mapping  = "$.Fish_Species_Present_at_Waterbody"
        name     = "Fish_Species_Present_at_Waterbody"
        sql_type = "VARCHAR(256)"
      }
      record_columns {
        mapping  = "$.Comments"
        name     = "Comments"
        sql_type = "VARCHAR(128)"
      }
      record_columns {
        mapping  = "$.Special_Regulations_on_Waterbody"
        name     = "Special_Regulations_on_Waterbody"
        sql_type = "VARCHAR(64)"
      }
      record_columns {
        mapping  = "$.$.Waterbody_Name"
        name     = "$.Waterbody_Name"
        sql_type = "VARCHAR(64)"
      }
      record_columns {
        mapping  = "$.Types_of_Public_Access"
        name     = "Types_of_Public_Access"
        sql_type = "VARCHAR(64)"
      }
      record_columns {
        mapping  = "$.Public_Fishing_Access_Owner"
        name     = "Public_Fishing_Access_Owner"
        sql_type = "VARCHAR(64)"
      }
      record_columns {
        mapping  = "$.Waterbody_Information"
        name     = "Waterbody_Information"
        sql_type = "VARCHAR(64)"
      }
      record_columns {
        mapping  = "$.Longitude"
        name     = "Longitude"
        sql_type = "DOUBLE"
      }
      record_columns {
        mapping  = "$.Latitude"
        name     = "Latitude"
        sql_type = "DOUBLE"
      }
      record_columns {
        mapping  = "$.Location[0:]"
        name     = "Location"
        sql_type = "VARCHAR(32)"
      }
      record_columns {
        mapping  = "$.Timestamp"
        name     = "COL_Timestamp"
        sql_type = "TIMESTAMP"
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
    command = "aws kinesisanalytics start-application --application-name ${aws_kinesis_analytics_application.app.name} --input-configurations Id=${var.application}_001,InputStartingPositionConfiguration={InputStartingPosition=NOW}"
  }
}
