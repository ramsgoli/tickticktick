var detectLang = require('lang-detector');
const fs = require('fs')

function sanitize(str) {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
}

function createConfig() {
  return {
    title: 'TickTickTick',
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
          },
          {
            label: 'C++',
            value: 'cpp'
          },
          {
            label: 'Python',
            value: 'python'
          },
          {
            label: 'React',
            value: 'react'
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

function createSuccessOutputText() {
  return "🚀 Code execution successful!"
}

function createFailOutputText() {
  return "🐛 Your code failed!"
}

function createOutputAttachments(text, color, id) {
  const attachments = [
    {
      "text": "```" + text + "```",
      "fallback": "You are unable to choose a game",
      "callback_id": "code-output",
      "color": color,
      "attachment_type": "default",
    }
  ]
  if (id) {
    const images = fs.readdirSync("public").filter(item => {
      return item.includes(id) && (item.endsWith("png") || item.endsWith("jpg") ||
          item.endsWith("jpeg") || item.endsWith("gif"))
    })
    images.forEach(image => {
      attachments.push({
        "attachment_type": "default",
        "color": color,
        "image_url": `http://2906f367.ngrok.io/${image}`
      })
    })
  }
  return attachments
}

function detect(code){
  var language = detectLang(code)
  switch (language) {
    case 'C++':
      return 'cpp';
      break;
    case 'C':
      return 'cpp';
      break;
    case 'JavaScript':
      return 'react'
      break;
    case 'Python':
      return 'python';
      break;
    case 'Java':
      return 'cpp';
      break;
    case 'HTML':
      return 'react'
      break;
    case 'CSS':
      return 'react';
      break;
    case 'Ruby':
      return 'cpp';
      break;
    case 'Go':
      return 'cpp';
      break;
    case 'PHP':
      return 'react';
      break;
    default:
      return 'bash'
      break;
  }
}

module.exports = {
  sanitize,
  createConfig,
  createSuccessOutputText,
  createFailOutputText,
  createOutputAttachments,
  detect
}
