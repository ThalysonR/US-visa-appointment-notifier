provider "aws" {
  region = var.aws_region
}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"
  function_name = "UsVisaNotifier"


  environment_variables = {
    "SNS_TOPIC_ARN": aws_sns_topic.sms_topic.arn
    "EMAIL": var.email
    "PASSWORD": var.password
    "COUNTRY_CODE": var.country_code
    "SCHEDULE_ID": var.schedule_id
    "FACILITY_ID": var.facility_id
    "NOTIFY_ON_DATE_BEFORE": var.notify_date_before
  }

attach_policy_json = true
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sns:Publish"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_sns_topic.sms_topic.arn}"
        ]
      }
    ]
  })

  memory_size = 512
  timeout = 30

  publish = true

  layers = [ "arn:aws:lambda:${var.aws_region}:764866452798:layer:chrome-aws-lambda:22" ]

  runtime = "nodejs12.x"
  handler = "index.handler"

  source_path = "${path.module}/lambda/function"

}

resource "random_pet" "lambda_bucket_name" {
  prefix = "us-visa-bucket"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}
