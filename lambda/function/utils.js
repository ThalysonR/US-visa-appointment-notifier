const debug = async (page, logName, saveScreenShot) => {
  if(saveScreenShot){
    await page.screenshot({path: `${logName}.png`});
  }

  await page.evaluate(() => {
    debugger;
  });
};


const logStep = (stepTitle) => {
  console.log("=====>>> Step:", stepTitle);
}

module.exports = {
  debug,
  logStep
}
