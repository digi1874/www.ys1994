import Vue from 'vue'
import { getTokenSignature, delToken } from '@/utils'

export default function ({ $axios, store, isDev }) {
  $axios.onRequest((config) => {
    // api url
    config.baseURL = isDev ? 'http://dev.api.ys1994.nl/' : 'https://api.ys1994.nl/'
    if (!process.server) {
      const token = getTokenSignature(store.state.ip.info.ip)
      if (token) {
        config.headers.auth = token
      }
    }
    return config
  })

  if (!process.server) {
    $axios.onError(({ response, message }) => {
      Vue.prototype.$message.error(response.data.msg || message)

      if (response.status === 401) {
        delToken(store.state.ip.info.ip)
        store.commit('user/setToken', '')
      }
    })
  }
}
