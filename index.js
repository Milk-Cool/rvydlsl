/**
 * Wikilipsum - Fetch a random article from Wikipedia and store it as a jekyll article.
 *
 * itamar@gizra.com
 */

var request = require("request");
var {htmlToText} = require("html-to-text");
const translatte = require('translatte');
const TelegramBot = require('node-telegram-bot-api');

const {TOKEN, ID} =process.env;
const bot = new TelegramBot(TOKEN, {polling:false});

var options = {
  headers: {'User-Agent': 'Wikilipsum'},
  json:true
};

function chaint(text, chain, cb){
    return chain.length > 0 ? translatte(text.slice(0, 1024), {to: chain[0]}).then(res => {
        chaint(res.text, chain.slice(1), cb)
    }).catch(console.error) : cb(text);
}

function rec(){
  options["url"] = "http://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1";
  request(options, function (error, response, body) {
    var pageId = body.query.random[0].id;
    options["url"] = "http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&pageid=" + pageId;
    request(options, function (error, response, body) {

      var permalink = "Источник: Wikipedia - " + body.parse.title;
      var content = htmlToText(body.parse.text["*"], {tables: true});

      content = content.replace(/\[.+\]/g, "");
      content = content.replace(/\/wiki\/File.+\.\w\w\w/g, "");
      
      chaint(content.slice(0, 1024), [
        "af",
        "sq",
        "am",
        "ar",
        "hy",
        "az",
        "eu",
        "be",
        "bn",
        "bs",
        "bg",
        "ca",
        "ceb",
        "ny",
        "zh",
        "zh-cn",
        "zh-tw",
        "co",
        "hr",
        "cs",
        "da",
        "nl",
        "en",
        "eo",
        "et",
        "tl",
        "fi",
        "fr",
        "fy",
        "gl",
        "ka",
        "de",
        "el",
        "gu",
        "ht",
        "ha",
        "haw",
        "he",
        "iw",
        "hi",
        "hmn",
        "hu",
        "is",
        "ig",
        "id",
        "ga",
        "it",
        "ja",
        "jw",
        "kn",
        "kk",
        "km",
        "ko",
        "ku",
        "ky",
        "lo",
        "la",
        "lv",
        "lt",
        "lb",
        "mk",
        "mg",
        "ms",
        "ml",
        "mt",
        "mi",
        "mr",
        "mn",
        "my",
        "ne",
        "no",
        "ps",
        "fa",
        "pl",
        "pt",
        "pa",
        "ro",
        "sm",
        "gd",
        "sr",
        "st",
        "sn",
        "sd",
        "si",
        "sk",
        "sl",
        "so",
        "es",
        "su",
        "sw",
        "sv",
        "tg",
        "ta",
        "te",
        "th",
        "tr",
        "uk",
        "ur",
        "uz",
        "vi",
        "cy",
        "xh",
        "yi",
        "yo",
        "zu",
        "ru"
    ], res => {
          console.log(res)
          bot.sendMessage(ID, permalink + "\n" + res.slice(0, 800));
          setTimeout(rec, 1000 * 60 * 60);
      });
    });
  });
}

require("http").createServer((req, res) => {
  res.writeHead(200);
  res.end("OK");
}).listen(8080);