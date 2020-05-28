/*
 * @Author: lin.zhenhui
 * @Date: 2020-03-06 18:51:00
 * @Last Modified by: lin.zhenhui
 * @Last Modified time: 2020-05-28 14:40:02
 */

import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import remove from 'lodash/remove'
import { setLocalStorageItem, getLocalStorageItem } from './localStorage'

// localStorage key
export const TOKEN_KEY_LIST = 'user_token_list'

/**
 * 获取token signature
 * @function
 * @returns {String}
 */
export const getTokenSignature = ip => getTokenInfo(ip).signature

/**
 * 获取token
 * @function
 * @returns {String}
 */
export const getToken = (ip) => {
  const tokenInfo = getTokenInfo(ip)
  return !isEmpty(tokenInfo) ? `${tokenInfo.payload}.${tokenInfo.signature}` : ''
}

/**
 * 获取token
 * @function
 * @returns {Object}
 */
export const getTokenInfo = (ip) => {
  const tokenList = getLocalStorageItem(TOKEN_KEY_LIST)
  const tokenInfo = find(tokenList, item => item.payloadInfo.ip === ip)
  if (isEmpty(tokenInfo) || !verifyExp(tokenInfo.payloadInfo.exp)) {
    delToken(ip)
    return {}
  }
  return tokenInfo
}

/**
 * 保存token
 * @function
 * @param   {String} token  登录或注册时从接口拿到的token，token = `${payload}.${signature}`
 * @returns {Boolean}       返回是否保存。
 */
export const setToken = (token) => {
  const tokenArray = token.split('.')
  if (tokenArray.length !== 2) {
    return false
  }

  const tokenInfo = {
    payloadInfo: {},
    payload: tokenArray[0],
    signature: tokenArray[1]
  }

  try {
    tokenInfo.payloadInfo = JSON.parse(atob(tokenInfo.payload))
  } catch (err) {
    return false
  }

  if (!verifyExp(tokenInfo.payloadInfo.exp)) {
    return false
  }

  const tokenList = getLocalStorageItem(TOKEN_KEY_LIST) || []
  remove(tokenList, item => item.payloadInfo.ip === tokenInfo.payloadInfo.ip)
  tokenList.push(tokenInfo)
  setLocalStorageItem(TOKEN_KEY_LIST, tokenList)
  return true
}

/**
 * 删除token
 * @function
 */
export const delToken = (ip) => {
  const tokenList = getLocalStorageItem(TOKEN_KEY_LIST) || []
  remove(tokenList, item => item.payloadInfo.ip === ip)
  setLocalStorageItem(TOKEN_KEY_LIST, tokenList)
}

/**
 * 验证exp，只验证是否过期
 * @function
 * @param    {String}   exp  过期时间unix
 * @returns  {Boolean}       返回是否有效。
 */
function verifyExp (exp) {
  return exp > new Date() / 1000
}
