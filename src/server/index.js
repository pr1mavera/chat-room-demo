import http from './request'

// 错误状态码
export const ERR_OK = '0'

/**
 * [getLoginInfo 获取用户登录信息]
 */
export const getLoginInfo = userId => http.get('TM', `/im/account/login?userId=${userId}&userType=3`)

/**
 * [pushSystemMsg 推送系统消息]
 */
export const pushSystemMsg = data => http.post('TM', '/im/msg/push', data)
