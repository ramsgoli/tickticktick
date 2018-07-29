const redis = require('redis');
const crypto = require('crypto');

const client = redis.createClient();

function sha1(code) {
  //Remove spaces and get 40 byte representation of input
  let noSpace = code.replace(/ /g,'').replace(/\n/g, '')
  return crypto.createHash('sha1').update(noSpace).digest('hex')
}

function redisSet(code, value) {
  return new Promise((resolve, reject) => {
    const key = sha1(code)
    client.set(key, value, 'EX', 60 * 60 * 24, (err, res) => {
       res ? resolve() : reject()
    })
  })
}

function redisGet(code) {
  return new Promise((resolve, reject) => {
    const key = sha1(code)
    client.get(key, (err, res) => {
      res ? resolve(res) : reject()
    })
  })
}

module.exports = {
  redisSet,
  redisGet
}
