/*
* @Author: Lahy
*/
// import ENV from './env';
const env = process.env.NODE_ENV
const production = {
  userPath: '/user-server/api/v1', // 用户服务,整合video-server,chat-server
  publicPath: '/cs-server/api/v1', // 用户服务,整合video-server,chat-server
  webRTCRoomPath: '/room-server/api/v1', // 房间服务
  TMPath: '/tm-server/api/v1', // 腾讯消息服务
  onlinePath: '/onlinePath', // 腾讯消息服务
  faceUploadPath: 'https://claim-internal.ihxlife.com:8081/api/v1' // 人脸识别文件上传路径
}

const development = {
  userPath: 'http://112.74.159.234:8083/api/v1',
  publicPath: 'http://chat-servertest.ihxlife.com/api/v1',
  // 112.74.159.80
  // https://vnap-webrtctest.ihxlife.com/cs-server/api/v1/video/cs/login
  webRTCRoomPath: 'http://112.74.229.22:8085/api/v1',
  TMPath: 'http://112.74.159.234:8084/api/v1',
  onlinePath: 'http://114.251.3.100:1500',
  faceUploadPath: 'http://112.74.159.234:8083/api/v1' // 人脸识别文件上传路径
  // onlinePath: 'http://114.251.3.100:1600'
}
const location = env === 'production' ? production : development
export default location
