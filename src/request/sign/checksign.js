import md5 from 'js-md5'
import { JSEncrypt } from 'jsencrypt'
// import jsrsasign from 'jsrsasign'

export function getsign (flag, postdata) {
  var resultarray = []
  propertyfilter(0, postdata.data, resultarray)
  resultarray.push('accountId=' + postdata.accountId)
  resultarray.push('accountKey=' + postdata.accountKey)
  resultarray = resultarray.sort()
  var sign = ''
  resultarray.forEach(element => {
    sign = sign + '&' + element
  })
  // sign = sign + '@961d8bbc1d5347cd0318f3f00e2cc681@' // 测试
  sign = sign + '4E5EF2E4EFFA8C68EC1AE67F401EACDD'
  // if (flag) {
  //   let unionID = window.localStorage.getItem('unionID')
  //   // sign = sign + 'orae60SLOjnhSiQ0rwTxg9kXno1c' // unionid
  //   sign = sign + unionID // unionid
  // }
  console.log(sign)
  sign = md5(sign)

  // 签名----------------------------------------------------------------------
  // 创建RSAKey对象
  // var rsa = new jsrsasign.RSAKey()
  // //  因为后端提供的是pck#8的密钥对，所以这里使用 KEYUTIL.getKey来解析密钥
  // var k = '-----BEGIN PRIVATE KEY-----MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAL/kgpCoRTHciUB+LaCgn2N8Hq/zZMsW/4awLPDOqnu58czD0IUfeJ2Cm3UZR9K4VWLakC7Cs1YuDOVtO0vgZSchgcBFG7xDDbEjFr+VaeYjae+dewj1DJ3NsEpMQdAxHlIWnrvcUFO5Wx6NndjyeovEwrJy70N8++hHspKXOUZTAgMBAAECgYEAuDWkBTwT2M7Nz2SRZo5rE/S1/NCZJMD6IZEEQ1MRo96XuasMhI72mbYkiB/xq96a0V/hY5Iy2HsylBftAWTzlBe+lsmR/xQxDZSI+A0LPj4Nxi9dbGdCVYW7baifMxod+qdw1+muGVNBBEDajk9+IXbuH5RSrJ5J3uzcV8lSLoECQQDqx7UVkndNN7r3dWS3/u8r+ks1BZdoMsyku8UaSXuWagu/B3vmO+bGutD8p0/13j3ph8BzIhkcOy8HY1Y7WoqTAkEA0Tx7IFSwk0gILIHJ2IaLQpFvalo9CRkhFMS8MW75hSEi+th57HGvfhj/uHqcEhkFxqA+ZzJOv3BmBMTpbobtQQJAAnuMIadD1bAyLO2z2/I5KzjhVLUzbamj2lYV9noycVu7thBpMf0OKqnNDe7i/JGWDAMgeNcydsb1b1mQjt4dOwJBAIasDPvkRrqlVE2BRC+Pebbg8PtdFYfzmq1Ja2/N4+BiUadvChq7mZ7p7D4K/MVRQbx0i3XUlYb2i1NqgmzXf4ECQH+vtVm8HRtrCCi4gZ2ykVLGHn89O7UlLiIGIXJkD2PLr/JWZkpICKClzqW94QFBmYOGdPQk/YurZk3tSA791J4=-----END PRIVATE KEY-----'
  // // 将密钥转码
  // rsa = jsrsasign.KEYUTIL.getKey(k)
  // // 创建Signature对象，设置签名编码算法
  // var sig = new jsrsasign.KJUR.crypto.Signature({'alg': 'SHA1withRSA'})
  // // 初始化
  // sig.init(rsa)
  // // 传入待加密字符串
  // sig.updateString(sign)
  // // 生成密文
  // var newsign = jsrsasign.hextob64(sig.sign())
  // return newsign
  // --------------------------------------------------------------------------

  // 加密----------------------------------------------------------------------
  var publickey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5y7h4gkYGOWJWa9mko766inLcf/oxxRT3F0A2SBNhhV3CZsNPt0ZWxescrdeEJoJmvl9Yd2MvdJ06lzlY081Q6za1lkChMn5Kho1Lbqd5wVWtukBSPfxqaqwHG6V8Dsd+O2AYvSkBHSFrkiBy1YFRzrVOIAjgtIoanqQ8M6VQWwIDAQAB-----END PUBLIC KEY-----'
  // 实例化一个JSEncrypt对象
  let jse = new JSEncrypt()
  jse.setPublicKey(publickey)
  sign = jse.encrypt(sign)
  let Base64 = require('js-base64').Base64
  Base64.encode(sign)
  return sign
  // --------------------------------------------------------------------------
}

function propertyfilter (key, params, resultarray) {
  if (params === null) {
    console.log('类型null')
  } else if (typeof params === 'string') {
    // console.log('类型string')
    if (params !== '') {
      var temp = key + '=' + params
      resultarray.push(temp)
    }
  } else if (typeof params === 'number') {
    // console.log('类型number')
    temp = key + '=' + params
    resultarray.push(temp)
  } else if (params instanceof Array) {
    // console.log('类型array')
    parsearray(key, params, resultarray)
  } else if (params instanceof Object) {
    // console.log('类型object')
    parsejson(params, resultarray)
  }
}

function parsejson (jsonobj, resultarray) {
  for (var item in jsonobj) {
    propertyfilter(item, jsonobj[item], resultarray)
  }
}

function parsearray (title, arrayobj, resultarray) {
  for (var key = 0; key < arrayobj.length; key++) {
    propertyfilter(title, arrayobj[key], resultarray)
  }
}
