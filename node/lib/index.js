const fs = require('fs');
const cmd = require('node-cmd');

const dockerMap = (epoch, key) => {
  const map = {
    'bash': `docker run \
            -v ${__dirname}/${epoch}:/scripts \
            -w /scripts \
            -t \
            ubuntu \
            bash script.sh \
              > ${__dirname}/${epoch}/output.txt`
  }
  return map[key]
}

const mockFile = () => {
  return `#!/usr/bin/env bash \n ls -al \n echo "start" \n sleep 5 \n echo "Hello, World!"`
}

const runCode = (interpreter = 'bash', file=mockFile()) => {
  return new Promise((resolve, reject) => {
    const epoch = new Date().getTime()
    const dir = `${__dirname}/${epoch}`

    fs.mkdirSync(dir)
    fs.writeFile(dir + '/script.sh', file, (err) => {
      cmd.get(`
        cd ${epoch}
        ${dockerMap(epoch, interpreter)}
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