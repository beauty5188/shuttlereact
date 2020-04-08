// axios封装
// 请求拦截、相应拦截、错误统一处理
import axios from 'axios'
import {getsign} from './sign/checksign'
import { Toast } from 'antd-mobile' // 对应的UI提示工具
import {HashRouter} from 'react-router-dom'
const router = new HashRouter()


const axiosIns = axios.create({
  // baseURL: "http://testtrade.piao.962168.com",
  baseURL: "http://trade.piao.962168.com",
  timeout: 10 * 1000,       // 超时设置 10s
  responseType: "json",
  withCredentials: false,   // 是否允许携带cookie, 跨站点
  headers: {
      // "system": 4,
      // "device-type": 6,
      // "device-code": "25F4BBFD679A33B736730D6F6C6A5E1F",
      "Content-Type": "application/json"
      // "Authorization":sessionStorage.getItem('Authorization')
  }
});

// 是否需要微信授权
function checkurlauth (url) {
  if (url.indexOf('/auth/') > 0) {
    return true
  } else {
    return false
  }
}

/* 请求拦截器 */
axiosIns.interceptors.request.use(
  config => {
    console.log(config.url)
    if (window.localStorage.getItem('refresh') === 'true') { // 有正在刷新token或授权的操作，不再接受请求
      if (config.url.indexOf('authorize') > 0 || config.url.indexOf('refreshToken') > 0) {
        console.log('正在刷新')
      } else {
        // console.log('不接受新请求')
        return
      }
    } else {
    }
    let istoken = checkurlauth(config.url)
    const isauth = window.localStorage.getItem('unionID')
    if (istoken) { // 是否需要token
      if (isauth) { // 微信已授权
        let mytoken = window.localStorage.getItem('token')
        // console.log(mytoken)
        mytoken && (config.headers.Authorization = mytoken)
      } else { // 跳转微信授权
        window.localStorage.setItem('refresh', 'true')
        let cururl = window.location.href
        let pos = cururl.indexOf('/dist/')
        window.localStorage.setItem('currentpage', cururl.substr(pos + 5))
        router.replace({path: '/wxredirect', query: { code: 'code', state: 'query' }})
        Promise.reject('去授权')
      }
    }
    var postdata = {}
    if (config.url.indexOf('/ccl/') >= 0) { // 定制班线
      postdata = { // 定制班线
        sign: '',
        accountId: 'DX2018', // 测试
        accountKey: '97675561', // 测试
        // accountId: 'C7S92A', // 生产 (5上线需修改共6)
        // accountKey: '05903560', // 生产 (6上线需修改共6)
        data: config.data
      }
    } else {
      postdata = { // 长途班线
        sign: '',
        accountId: '728697185959', // 测试
        accountKey: '00983582', // 测试
        // accountId: 'C7S92A', // 生产 (5上线需修改共6)
        // accountKey: '05903560', // 生产 (6上线需修改共6)
        data: config.data
      }
    }
    var sign = getsign(istoken, postdata)
    postdata.sign = sign
    config.data = postdata
    return config
  },
  /* 错误操作 */
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器 TODO:如果token失效，要刷新
axiosIns.interceptors.response.use(
  response => {
    if (response.status === 200) {
      let code = (response.data.code).replace(/(^\s*)|(\s*$)/g, '')
      if (response.data.success === false && (code === '9104' || code === '9105')) { // token失效
        // console.log(window.location.href) // http://localhost:8080/dist/selectpassenger/1/1145882773889441794/1141584004607897602
        console.log('刷新token')
        window.localStorage.setItem('refresh', 'true')
        router.replace({
          path: '/refreshtoken',
          query: { redirect: window.location.href }// 直接刷新当前页面
        })
        return Promise.reject(response)
      }
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => { // 服务器状态码不是200的情况
    console.log(error)
    console.log(error.code)
    console.log(error.message)
    // 网络异常
    if (error.message.indexOf('Network Error') > -1) {
      console.log()
      Toast('网络异常！')
    } // 请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Toast('网络异常！')
      console.log('根据你设置的timeout/真的请求超时,你可以在这里加入超时的处理方案')
    // return service.request(originalRequest);//例如再重复请求一次
    }
  }
)

function post(url, param,responseType='json') {
  return new Promise((resolve, reject) => {
      axiosIns({
          method: "post",
          url,
          data: param,
          responseType:responseType
      }).then(res => resolve(res.data))
          .catch(err => {
              reject(err);
          });
  })
}

function get(url,param,responseType='json') {
  return new Promise((resolve, reject) => {
      axiosIns({
          method: "get",
          url,
          data: param,
          responseType:responseType
      }).then(res => resolve(res.data))
          .catch(err => {
              reject(err);
          });
  })
}

export {get,post}
