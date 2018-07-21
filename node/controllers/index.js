const util = require('../util')
const lib = require('../lib')

function postHandler(req, res) {

  if (!req.body.text) {
    res.send()
    const dialog = util.createConfig()
    return req.web.dialog.open({trigger_id: req.body.trigger_id, dialog: dialog})
  } else {
    res.send()
    req.web.chat.postMessage({
      channel: req.body.channel_id,
      text: "⏳ Running your code...",
      attachments: util.createOutputAttachments(req.body.text, "#3AA3E3")
    })
    const sanitized = util.sanitize(req.body.text)
    const lang = util.detect(sanitized)

    console.log(lang);

    lib.runCode('bash', sanitized)
      .then(res => {
        req.web.chat.postMessage({
          channel: req.body.channel_id,
          text: util.createOutputText(),
          attachments: util.createOutputAttachments(res, '#228B22')
        })
      })
      .catch(err => {
        req.web.chat.postMessage({
          channel: req.body.channel_id,
          text: "Couldnt run your code"
        })
      })
  }
}

function dialogHandler(req, res) {
  res.send()
  const payload = JSON.parse(req.body.payload)

  req.web.chat.postMessage({
    channel: payload.channel.id,
    text: "⏳ Running your code...",
    attachments: util.createOutputAttachments(payload.submission.code, "#3AA3E3")
  })

  const sanitized = util.sanitize(payload.submission.code)
  const lang = util.detect(sanitized)

  lib.runCode('bash', sanitized)
    .then(res => {
      req.web.chat.postMessage({
        channel: payload.channel.id,
        text: util.createOutputText(),
        attachments: util.createOutputAttachments(res, '#228B22')
      })
    })
    .catch(err => {
      req.web.chat.postMessage({channel: payload.channel.id, text: err})
    })
}

module.exports = {
  postHandler,
  dialogHandler
}
