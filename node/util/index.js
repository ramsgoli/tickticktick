var detectLang = require('lang-detector');

function sanitize(str) {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
}

function createConfig() {
  return {
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
    ]
  }
}

function createOutputText() {
  return "🚀 Code execution successful!"
}

function createOutputAttachments(text) {
  const attachments = [
    {
      "text": "```" + text + "```",
      "fallback": "You are unable to choose a game",
      "callback_id": "code-output",
      "color": "#3AA3E3",
      "attachment_type": "default",
    }
  ]

  return attachments
}

function detect(code){
  var language = detectLang(code)
  switch (language) {
    case 'C++':
      return 'C++';
      break;
    case 'C':
      return 'C++';
      break;
    case 'JavaScript':
      return 'React'
      break;
    case 'Python':
      return 'Python';
      break;
    case 'Java':
      return 'C++';
      break;
    case 'HTML':
      return 'React'
      break;
    case 'CSS':
      return 'React';
      break;
    case 'Ruby':
      return 'C++';
      break;
    case 'Go':
      return 'C++';
      break;
    case 'PHP':
      return 'React';
      break;
    default:
      return 'Bash'
      break;
  }
}

module.exports = {
  sanitize,
  createConfig,
  createOutputText,
  createOutputAttachments,
  detect
}
