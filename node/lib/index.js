const fs = require('fs');
const cmd = require('node-cmd');

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
  }
}

const dockerMap = (epoch, key) => {

  const dockerCLI = `docker run \
                    -v ${__dirname}/${epoch}:/scripts \
                    -v ${__dirname}/docker/${key}:/internal/run \
                    -w /scripts \
                    -t`

  const pipeOutput = `> ${__dirname}/${epoch}/output.txt`
  return `${dockerCLI} ${map[key]['container']} bash /internal/run/run.sh ${pipeOutput}`
}

const mockFile = () => (
  `echo "Hello, World!"`
)

const mockCPP = () => {
  return `#include <iostream>

  using namespace std;

  auto main() -> int {
    cout << " Hello From Mock " << endl;
  }`
}

const mockPY = () => (
  `print("hello from python")`
)

const runCode = (language = 'bash', file=mockFile()) => {
  return new Promise((resolve, reject) => {
    const epoch = new Date().getTime()
    const dir = `${__dirname}/${epoch}`

    fs.mkdirSync(dir)
    fs.writeFile(`${dir}/${map[language]['filename']}`, file, (err) => {
      cmd.get(`
        cd ${epoch}
        ${dockerMap(epoch, language)}
      `, (err, data) => {
        fs.readFile(dir + '/output.txt', 'utf8', (err, data) => {
          cmd.run(`rm -r ${dir}`)
          if (err) reject(err)
          resolve(data)
        })
      })
    })
  })
}

module.exports = {
  runCode
}
