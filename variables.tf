# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

# Input variable definitions

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "us-east-1"
}

variable "email" {
  type = string
}

variable "password" {
  type = string
}

variable "country_code" {
  type = string
}

variable "schedule_id" {
  type = string
}

variable "facility_id" {
  type = string
}

variable "node_env" {
  type = string
}

variable "notify_date_before" {
  type = string
}

variable "target_phone" {
  type = string
}