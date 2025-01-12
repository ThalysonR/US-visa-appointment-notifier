const chromium = require('@sparticuz/chrome-aws-lambda')
const {parseISO, compareAsc, isBefore, format} = require('date-fns')
require('dotenv').config();

const { logStep} = require('./utils');
const {sendMessage} = require('./sns');
const {siteInfo, loginCred, NOTIFY_ON_DATE_BEFORE} = require('./config');

let isLoggedIn = false;

const login = async (page) => {
  logStep('logging in');
  await page.goto(siteInfo.LOGIN_URL);

  const form = await page.$("form#sign_in_form");

  const email = await form.$('input[name="user[email]"]');
  const password = await form.$('input[name="user[password]"]');
  const privacyTerms = await form.$('input[name="policy_confirmed"]');
  const signInButton = await form.$('input[name="commit"]');

  await email.type(loginCred.EMAIL);
  await password.type(loginCred.PASSWORD);
  await privacyTerms.click();
  await signInButton.click();

  await page.waitForNavigation();

  return true;
}

const notifyMe = async (earliestDate) => {
  const formattedDate = format(earliestDate, 'dd-MM-yyyy');
  logStep(`sending an sms to schedule for ${formattedDate}`);

  await sendMessage(
    `We found an earlier date ${formattedDate}
    Hurry and schedule for ${formattedDate} before it is taken.`
  )
}

const checkForSchedules = async (page) => {
  logStep('checking for schedules');
  await page.setExtraHTTPHeaders({
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest'
  });
  await page.goto(siteInfo.APPOINTMENTS_JSON_URL);

  const originalPageContent = await page.content();
  const bodyText = await page.evaluate(() => {
    return document.querySelector('body').innerText
  });

  try{
    console.log(bodyText);
    const parsedBody =  JSON.parse(bodyText);

    if(!Array.isArray(parsedBody)) {
      throw "Failed to parse dates, probably because you are not logged in";
    }

    const dates =parsedBody.map(item => parseISO(item.date));
    const [earliest] = dates.sort(compareAsc)

    return earliest;
  }catch(err){
    console.log("Unable to parse page JSON content", originalPageContent);
    console.error(err)
    isLoggedIn = false;
  }
}


module.exports.handler = async () => {
  // const browser = await puppeteer.launch(!IS_PROD ? {headless: false}: undefined);
  logStep('launching browser');
  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  logStep(`starting process`);

  const page = await browser.newPage();

  // always login
  await login(page);
  // if(!isLoggedIn) {
  //    isLoggedIn = await login(page);
  // }

  const earliestDate = await checkForSchedules(page);
  if(earliestDate && isBefore(earliestDate, parseISO(NOTIFY_ON_DATE_BEFORE))){
    await notifyMe(earliestDate);
  }
}

