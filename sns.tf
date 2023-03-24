locals {
  phone_numbers = [var.target_phone]
}

resource "aws_sns_topic" "sms_topic" {
  name            = "sms-topic"
  delivery_policy = jsonencode({
    "http" : {
      "defaultHealthyRetryPolicy" : {
        "minDelayTarget" : 20,
        "maxDelayTarget" : 20,
        "numRetries" : 3,
        "numMaxDelayRetries" : 0,
        "numNoDelayRetries" : 0,
        "numMinDelayRetries" : 0,
        "backoffFunction" : "linear"
      },
      "disableSubscriptionOverrides" : false,
      "defaultThrottlePolicy" : {
        "maxReceivesPerSecond" : 1
      }
    }
  })
}

resource "aws_sns_topic_subscription" "topic_sms_subscription" {
  count     = length(local.phone_numbers)
  topic_arn = aws_sns_topic.sms_topic.arn
  protocol  = "sms"
  endpoint  = local.phone_numbers[count.index]
}