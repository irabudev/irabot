const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const mongoose = require('mongoose');
const axios = require('axios');
 
require('./db')

// Bot config
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, {
  polling: true
});

// Init Models
// const Chuck = mongoose.model('ChuckNoris');
const Bookmark = mongoose.model('Bookmark');

let siteUrl;
bot.on(/\/chuck/, (msg) => {
  const chatId = msg.chat.id;
  // fetch a random chucknoris joke
  axios.get('https://api.chucknorris.io/jokes/random')
  .then(function (response) {
    // handle success
    console.log(response);
    bot.sendMessage(message.chat.id, response.value);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
// Reply to /bookmark
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id, 'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Development',
          callback_data: 'development'
        }, {
          text: 'Music',
          callback_data: 'music'
        }, {
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }]
      ]
    }
  });
});

// Callback query
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  // Scrap OG date
  ogs({
    'url': siteUrl
  }, function (error, results) {
    if (results.success) {
      // Push to Firebase
      // sitesRef.push().set({
      //   name: results.data.ogSiteName,
      //   title: results.data.ogTitle,
      //   description: results.data.ogDescription,
      //   url: siteUrl,
      //   thumbnail: results.data.ogImage.url,
      //   category: callbackQuery.data
      // });
      const data = {
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      };
      const _bookmark = new Bookmark(data);
      _bookmark.save()
        .then(() => {
          // Reply 
          bot.sendMessage(message.chat.id, 'Added \"' + results.data.ogTitle + '\" to category \"' + callbackQuery.data + '\"!');
        })
        .catch((err) => {
          console.log(err);
          // Reply 
          bot.sendMessage(message.chat.id, 'Sorry! Something went wrong.');
        });
      // Reply 
      // bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!');
    } else {
      // Push to Firebase
      // sitesRef.push().set({
      //   url: siteUrl
      // });
      const _bookmark = new Bookmark({
        url: siteUrl
      });
      _bookmark.save()
      .then(() => {
        // Reply 
        bot.sendMessage(message.chat.id, 'Added new website, but there was no OG data!');
      })
      .catch((err) => {
        console.log(err);
        // Reply 
        bot.sendMessage(message.chat.id, 'Sorry! Something went wrong.');
      });

      // Reply 
      // bot.sendMessage(message.chat.id, 'Added new website, but there was no OG data!');
    }
  });
});