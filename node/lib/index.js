const fs = require('fs');
const cmd = require('node-cmd');
const { redisSet } = require('../redis')

var map = {
  'bash': {
    'container': 'tickticktick-bash:latest',
    'filename': 'script.sh'
  },
  'cpp': {
    'container': 'tickticktick-cpp:latest',
    'filename': 'main.cpp'
  },
  'python': {
    'container': 'tickticktick-python:latest',
    'filename': 'script.py'
  },
  'react': {
    'container': 'tickticktick-react:latest',
    'filename': 'index.js'
  }
}

const dockerMap = (epoch, key, imageID) => {

  const dockerCLI = `docker run \
                    -v ${__dirname}/${epoch}:/scripts \
                    -v ${__dirname}/docker/${key}:/internal/run \
                    -w /scripts \
                    --network none \
                    --cpus=".3" \
                    -t`

  const pipeOutput = key === 'react'
   ? `> ${__dirname}/../public/${imageID}.png`
   : `> ${__dirname}/${epoch}/output.txt`
  return `${dockerCLI} ${map[key]['container']} bash /internal/run/run.sh ${pipeOutput}`
}

const mockFile = () => (
  `echo "Hello, World!"`
)

const mockCPP = () => (
  `#include <iostream>

  using namespace std;

  auto main() -> int {
    cout << " Hello From Mock " << endl;
  }`
)

const mockPY = () => (
  `print("hello from python")`
)

const runCode = (language = 'bash', file=mockFile(), imageID) => {
  return new Promise((resolve, reject) => {
    const epoch = new Date().getTime()
    const dir = `${__dirname}/${epoch}`

    fs.mkdirSync(dir)
    fs.writeFile(`${dir}/${map[language]['filename']}`, file, (err) => {
      cmd.get(`
        cd ${epoch}
        ${dockerMap(epoch, language, imageID)}
      `, (err, data) => {
        if (language === 'react') {
          cmd.run(`rm -r ${dir}`)
          resolve()
        }
        fs.readFile(dir + '/output.txt', 'utf8', (err, data) => {
          cmd.run(`rm -r ${dir}`)
          if (err) reject(err)
          if (language === 'python' || language === 'bash' || language === 'cpp') {
            redisSet(file, data)
              .then(resolve(data))
              .catch(reject(data))
          } else {
            resolve(data)
          }
        })
      })
    })
  })
}

module.exports = {
  runCode
}
