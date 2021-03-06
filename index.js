const linebot = require('linebot')
const express = require('express')
const rp = require('request-promise')
const lineUser = require('./database/connect.js').lineUser
const schedule = require('node-schedule')

const SITE_NAME = '臺南'
const apiOpt = {
  url: 'http://opendata2.epa.gov.tw/AQI.json',
  json: true
}
const apiNews = {
  url: 'https://newsapi.org/v2/top-headlines?country=tw&apiKey=dce93a0065e54403b42314f5c18ea8c8',
  json: true
}

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

const linebotParser = bot.parser()

function readResult (result) {
  let data
  for (let i in result) {
    if (result[i].SiteName === SITE_NAME) {
      data = result[i]
      break
    }
  }
  return data
}

function readNews (result) {
  let data = []
  let array = result.articles
  while (data.length < 3) {
    let number = Math.floor((Math.random() * array.length))
    data.push(array[number].url)
    array.splice(number, 1)
  }
  return data
}

(function scheduleRecurrenceRule () {
  let rule = new schedule.RecurrenceRule()
  rule.hour = 0
  rule.minute = 0
  rule.second = 0
  schedule.scheduleJob(rule, () => {
    lineUser.findAll({ attributes: ['userId'] })
      .then(result => {
        let Id = []
        for (let value in result) Id.push(result[value].dataValues.userId)
        rp(apiNews)
          .then(result => {
            let data = readNews(result)
            bot.multicast(Id, data)
          }).catch(() => {
            bot.multicast(Id, {
              type: 'text',
              text: '無法取得空氣品質資訊'
            })
          })
      })
  })
}())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/webhook', linebotParser)

bot.on('follow', event => {
  lineUser.findOrCreate({ where: { userId: `${event.source.userId}` } })
    .then(result => {
    })
})

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
        case '新聞':
          rp(apiNews)
            .then(result => {
              let data = readNews(result)
              event.reply(data)
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
