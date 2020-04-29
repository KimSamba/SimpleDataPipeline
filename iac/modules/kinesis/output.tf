output "stream_input_arn" {
    value = aws_kinesis_stream.stream_input.arn
}

output "stream_output_arn" {
    value = aws_kinesis_stream.stream_output.arn
}

output "stream_input_name" {
    value = aws_kinesis_stream.stream_input.name
}

output "stream_output_name" {
    value = aws_kinesis_stream.stream_output.name
}