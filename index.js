https://iwb.jp/puppeteer-webpage-diff-image-screenshot/
const fs = require('fs');
const puppeteer = require('puppeteer');
const imageDiff = require('image-diff');
 
fs.access('screenshot.png', err => {
  if (!err) {
    fs.rename('screenshot.png', 'screenshot.old.png', () => {});
  }
});
 
puppeteer.launch({
  headless: false,
  slowMo: 100
}).then(async browser => {
  const page = await browser.newPage();
  const url = process.argv[2];
  console.log(url)
  await page.goto(url);
  await page.$eval('.widget-area .adsense', e => e.remove());
  await page.screenshot({path: 'screenshot.png', fullPage: true});
  fs.access('screenshot.old.png', err => {
    if (!err) {
      imageDiff({
        actualImage: 'screenshot.png',       // 元となる画像
        expectedImage: 'screenshot.old.png', // 比較する画像
        diffImage: 'screenshot.diff.png',    // 同じであれば真っ白
      }, (err, imagesAreSame) => {
        if (imagesAreSame) {
          console.log('前回と同じ画像です。');
        } else {
          console.log('前回と異なる画像です。');
        }
      });
    } else {
      console.log('最初の画像を保存しました。')
    }
  });
  await browser.close();
});
