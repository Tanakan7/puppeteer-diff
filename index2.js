// https://qiita.com/KamataRyo/items/943aeb4378b3863242f1
const puppeteer = require('puppeteer')
const looksSame = require('looks-same')

const URL_A = 'https://qiita.com/KamataRyo/items/943aeb4378b3863242f1'
const URL_B = 'https://qiita.com/KamataRyo/items/943aeb4378b3863242f1'

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200
  })
  const page = await browser.newPage()
  // await page.setViewport({ width: 512, height: 100 })

  const pathA = 'dist/a.png'
  const pathB = 'dist/b.png'
  const pathDiff = 'dist/diff.png'
  await page.goto(URL_A)
  await page.screenshot({ path: pathA, fullPage: true })
  await page.goto(URL_B)
  await page.screenshot({ path: pathB, fullPage: true })

  await new Promise((resolve, rejecct) =>
    looksSame.createDiff(
      {
        reference: pathA,
        current: pathB,
        diff: pathDiff,
        highlightColor: '#ff00ff'
      },
      error => (error ? reject() : resolve())
    )
  )

  await browser.close()
})()
