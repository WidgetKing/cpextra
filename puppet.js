const puppeteer = require('puppeteer');

(async () => {
const browser = await puppeteer.launch();
    console.log("Hello world!")
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    await page.screenshot('example.png')
    await browser.close()
    console.log("Goodbye world!")
})();
