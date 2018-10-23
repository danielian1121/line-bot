const linebot = require('linebot')
const express = require('express')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

const linebotParser = bot.parser()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/webhook', linebotParser)

bot.on('message', event => {
  event.reply(event.message.text)
    .then(data => {
      console.log('successs', data)
    }).catch(error => {
      console.log('error', error)
    })
})

app.listen(process.env.PORT || 80, () => {
  console.log('LineBot is running')
})
