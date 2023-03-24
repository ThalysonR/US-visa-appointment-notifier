# US-visa-appointment-notifier

This is just a script I forked from @theoomoregbee to check and notify me via **sms** when there's an earlier date before my initial appointment date. It doesn't handle **rescheduling**.

Running `terraform apply` will create a lambda to run this code on a schedule, along with all the necessary infrastructure on aws.


```
$ npm start
=====>>> Step: logging in
=====>>> Step: checking for schedules
[{"date":"2023-02-08","business_day":true},{"date":"2023-04-26","business_day":true},{"date":"2023-10-11","business_day":true}]

...
```


## How it works

* Logs you into the portal
* checks for schedules by day 
* If there's a date before your initial appointment, it notifies you via sms
* If no dates found, the lambda finishes it's run until the next scheduled run

> see `config.js` or `variables.tf` for values you can configure

## Configuration

Set all the variables required by terraform (listed on `variables.tf`). See [terraform input variable documentation](https://developer.hashicorp.com/terraform/language/values/variables) on different ways to set them.
I use [direnv](https://direnv.net/).

## FAQ

* How do I get my facility ID - https://github.com/theoomoregbee/US-visa-appointment-notifier/issues/3
* How do I get my schedule ID - https://github.com/theoomoregbee/US-visa-appointment-notifier/issues/8, https://github.com/theoomoregbee/US-visa-appointment-notifier/issues/7#issuecomment-1372565292

## How to use it

* clone the repo 
* have an authenticated aws cli
* set required variables
* run `terraform apply`


