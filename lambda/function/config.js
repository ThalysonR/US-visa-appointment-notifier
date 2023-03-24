module.exports = {
  AWS_REGION: process.env.AWS_REGION,
  SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN,
  loginCred:{
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
  },

  siteInfo: {
    COUNTRY_CODE: process.env.COUNTRY_CODE || 'en-ca',
    SCHEDULE_ID: process.env.SCHEDULE_ID,
    FACILITY_ID: process.env.FACILITY_ID,

    get APPOINTMENTS_JSON_URL(){
      return `https://ais.usvisa-info.com/${this.COUNTRY_CODE}/niv/schedule/${this.SCHEDULE_ID}/appointment/days/${this.FACILITY_ID}.json?appointments%5Bexpedite%5D=false`
    },

    get LOGIN_URL () {
      return `https://ais.usvisa-info.com/${this.COUNTRY_CODE}/niv/users/sign_in`
    }
  },
  IS_PROD: process.env.NODE_ENV === 'prod',
  NOTIFY_ON_DATE_BEFORE: process.env.NOTIFY_ON_DATE_BEFORE, // in ISO format i.e YYYY-MM-DD
}
