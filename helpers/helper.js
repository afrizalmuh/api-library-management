const CryptoJS = require("crypto-js")
const { text } = require("express")
const randomstring = require('randomstring')
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

const transformToSafePayload = (payload) => {
  if (typeof payload == 'object') {
    return JSON.stringify(payload);
  }
  if (typeof payload != 'string') {
    return payload.toString();
  }
  return payload;
}

const encryptText = (text) => {
  try {
    const key = CryptoJS.enc.Hex.parse('4D344E343933525F344652495A344C')
    const iv = CryptoJS.enc.Hex.parse('4D344E343933525F344652495A344C')

    let encryptedText = CryptoJS.AES.encrypt(transformToSafePayload(text), key, { iv: iv })
    return encryptedText.toString()
  } catch (e) {

  }
}

const encryptTextSecret = (text) => {
  try {
    let encryptedText = CryptoJS.AES.encrypt(transformToSafePayload(text), process.env.SECRET_KEY).toString();
    return encryptedText;
  } catch (error) {
    return error.message;
  }
};

const decryptTextSecret = (chipertext) => {
  try {
    return CryptoJS.AES.decrypt(transformToSafePayload(chipertext), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    //console.log(error.message)
    return error.message;
  }
};

const decryptText = (text) => {
  try {
    const key = CryptoJS.enc.Hex.parse('4D344E343933525F344652495A344C')
    const iv = CryptoJS.enc.Hex.parse('4D344E343933525F344652495A344C')

    let encryptedText = CryptoJS.AES.decrypt(text, key, { iv: iv })
    //console.log(encryptedText.toString(CryptoJS.enc.Utf8))
  } catch (e) {

  }
}

// const getRandomStrig = () => {
//   try {
//     return crypto.randomBytes(4).toString('hex');
//   } catch (error) {
//     return error.message;
//   }
// };

const getRandomStrig = async () => {
  try {
    return randomstring.generate({
      length: 50,
      charset: 'alphanumeric'
    })
  } catch (error) {
    return error.message;
  }
};

const changeTimezone = (time) => {
  let date = dayjs.tz(time).tz('Asia/Jakarta')
  return date.format("YYYY-MM-DD HH:mm:ss")
}

module.exports = {
  encryptText,
  encryptTextSecret,
  decryptTextSecret,
  decryptText,
  getRandomStrig,
  changeTimezone
}