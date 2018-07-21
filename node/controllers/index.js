const util = require('../util')
const lib = require('../lib')

function postHandler(req, res) {
  res.send()

  const dialog = {
    title: 'Your Code',
    callback_id: 'code-input',
    submit_label: 'Run',
    elements: [
      {
        label: 'Language',
        type: 'select',
        name: 'language_select',
        options: [
          {
            "label": "Bash",
            "value": "bash"
          }
        ]
      },
      {
        label: 'Your Code',
        type: 'textarea',
        name: 'code',
        optional: false,
      }
    ],
  }

  req.web.dialog.open({trigger_id: req.body.trigger_id, dialog: dialog})
}

function dialogHandler(req, res) {
  console.log(req.body)
  res.send()
  const payload = JSON.parse(req.body.payload)

  req.web.chat.postMessage({
    channel: payload.channel.id,
    text: "```" + payload.submission.code + "```"
  })
  lib.runCode('bash', payload.submission.code)
    .then(res => {
      req.web.chat.postMessage({channel: payload.channel.id, text: res})
    })
    .catch(err => {
      req.web.chat.postMessage({channel: payload.channel.id, text: err})
    })
}

module.exports = {
  postHandler,
  dialogHandler
}