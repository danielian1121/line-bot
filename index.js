const linebot = require('linebot')
const express = require('express')
const rp = require('request-promise')

const SITE_NAME = '臺南'
const apiOpt = {
  url: 'http://opendata2.epa.gov.tw/AQI.json',
  json: true
}

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

const linebotParser = bot.parser()

function readResult(result) {
  let data
  for (i in repos) {
      if (repos[i].SiteName === SITE_NAME) {
          data = repos[i];
          break;
      }
  }
  return data
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/webhook', linebotParser)

bot.on('message', event => {
  switch (event.message.type) {
    case 'text':
      switch (event.message.text) {
        case '空氣':
          let data
          rp(apiOpt)
            .then(result => {
              data = readResult(result)
              event.reply(data.County + data.SiteName +
                '\n\nPM2.5指數：' + data['PM2.5_AVG'] +
                  '\n狀態：' + data.Status)
            }).catch(() => {
              event.reply('無法取得空氣品質資料～')
            })
          break
      }
      break
    default:
      event.reply('Unknow message: ' + JSON.stringify(event))
      break
  }
})

app.listen(process.env.PORT || 80, () => {
  console.log('LineBot is running')
})
