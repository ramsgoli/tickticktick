const util = require('../util')
const lib = require('../lib')

function postHandler(req, res) {

  if (!req.body.text) {
    res.send()
    const dialog = util.createConfig()
    return req.web.dialog.open({trigger_id: req.body.trigger_id, dialog: dialog})
  } else {
    res.send(req.body.text)
    const sanitized = util.sanitize(req.body.text)
    const lang = 'bash'

    lib.runCode(lang, sanitized)
      .then(res => {
        req.web.chat.postMessage({
          channel: req.body.channel_id,
          text: util.createOutputText(),
          attachments: util.createOutputAttachments(res)
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
    text: "```" + payload.submission.code + "```"
  })
  lib.runCode('bash', payload.submission.code)
    .then(res => {
      req.web.chat.postMessage({
        channel: payload.channel.id,
        text: util.createOutputText(),
        attachments: util.createOutputAttachments(res)
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