const util = require('../util')
const lib = require('../lib')
const { redisGet } = require('../redis')

function postHandler(req, res) {

  if (!req.body.text) {
    res.send()
    const dialog = util.createConfig()
    return req.web.dialog.open({trigger_id: req.body.trigger_id, dialog: dialog})
  } else {
    res.send()
    const sanitized = util.sanitize(req.body.text)
    const lang = util.detect(sanitized)
    req.web.chat.postMessage({
      channel: req.body.channel_id,
      text: `⏳ Running your ${lang} code...`,
      attachments: util.createOutputAttachments(req.body.text, "#3AA3E3")
    })

    if (lang === 'python' || lang === 'cpp' || lang === 'bash') {
      cachedCode(req, lang, sanitized)
    } else {
      runCode(req, lang, sanitized)
    }

  }
}

async function cachedCode(req, lang, sanitized) {
  try {
    const reply = await redisGet(sanitized)

    if (reply) {
      setTimeout(() => {
        req.web.chat.postMessage({
          channel: req.body.channel_id,
          text: util.createSuccessOutputText(),
          attachments: util.createOutputAttachments(reply, '#228B22', req.body.trigger_id)
        })
      }, 100)
    } else {
      runCode(req, lang, sanitized)
    }
  } catch (e) {
    runCode(req, lang, sanitized)
  }
}

async function runCode(req, lang, sanitized) {
  try {
    const res = await lib.runCode(lang, sanitized, req.body.trigger_id)
    req.web.chat.postMessage({
      channel: req.body.channel_id,
      text: util.createSuccessOutputText(),
      attachments: util.createOutputAttachments(res, '#228B22', req.body.trigger_id)
    })
  } catch (e) {
    req.web.chat.postMessage({
      channel: req.body.channel_id,
      text: "Couldnt run your code"
    })
  }
}


function dialogHandler(req, res) {
  res.send()
  const payload = JSON.parse(req.body.payload)

  req.web.chat.postMessage({
    channel: req.body.channel_id || payload.channel.id,
    text: "⏳ Running your code...",
    attachments: util.createOutputAttachments(payload.submission.code, "#3AA3E3")
  })

  const sanitized = util.sanitize(payload.submission.code)

  lib.runCode(payload.submission.language_select, sanitized)
    .then(res => {
      req.web.chat.postMessage({
        channel: req.body.channel_id || payload.channel.id,
        text: util.createSuccessOutputText(),
        attachments: util.createOutputAttachments(res, '#228B22')
      })
    })
    .catch(err => {
      req.web.chat.postMessage({
        channel: req.body.channel_id,
        text: err
      })
    })
}

module.exports = {
  postHandler,
  dialogHandler
}
