import axios from 'axios'
import conf from '../config/index'

// axios.defaults.withCredentials = true

// 全局路径
// publicPath: 'http://192.168.8.102:8081/api/v1'

const hostFilter = hostType => {
  switch (hostType) {
    case 'video':
      return conf.videoPath
    case 'RTCRoom':
      return conf.webRTCRoomPath
    case 'TM':
      return conf.TMPath
    case 'user':
      return conf.userPath
    case 'chat':
      return conf.chatPath
    case 'online':
      return conf.onlinePath
    case 'public':
      return conf.publicPath
    case 'history':
      return conf.historyPath
    case 'faceUpload':
      return conf.faceUploadPath
  }
}

export default {
  post: (hostType, url, data, error, option) => axios.post(hostFilter(hostType) + url, data, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.error(err)
      }
    }),
  get: (hostType, url, error, option) => axios.get(hostFilter(hostType) + url, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  put: (hostType, url, data, error, option) => axios.put(hostFilter(hostType) + url, data, option)
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  delete: (hostType, url, error, option) => axios.delete(hostFilter(hostType) + url, option) // eslint-disable-line
    .then(response => response.data)
    .catch((err) => {
      if (error) {
        error(err)
      } else {
        console.log(err)
      }
    }),
  url: (hostType, path) => hostFilter(hostType) + path
}
