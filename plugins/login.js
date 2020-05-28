import isEmpty from 'lodash/isEmpty'
import Vue from 'vue'
import { getToken, setToken, delToken, getLocalStorageItem, TOKEN_KEY_LIST, getTokenSignature } from '@/utils'

export default function ({ $api, store, isDev }) {
  const host = isDev ? 'dev.login.ys1994.nl' : 'login.ys1994.nl'
  const href = `http://${host}/?title=影视1994&bgImg=linear-gradient(%234a444b%2C%20%23859b93)&redirect=`
  const goLogin = () => {
    return new Promise((resolve, reject) => {
      const loginWindow = window.open(href + encodeURIComponent(window.location.origin + '/login'), 'login')
      const watch = () => {
        goLogin.timer = setTimeout(() => {
          if (!loginWindow.closed) {
            try {
              const jwt = loginWindow.location.search.replace(/.+jwt=(.+)/, '$1')
              setToken(jwt) ? resolve() : reject(new Error(jwt))
              loginWindow.close()
            } catch (err) {
              watch()
            }
          } else {
            reject(new Error('窗口关闭'))
          }
        }, 1000)
      }
      watch()
    })
  }

  const setUserToken = () => store.commit('user/setToken', getToken(store.state.ip.info.ip))
  let getIpInfo

  Vue.prototype.$hasLogin = () => {
    return new Promise((resolve) => {
      if (store.state.ip.info.ip || isEmpty(getLocalStorageItem(TOKEN_KEY_LIST))) {
        setUserToken()
        resolve()
        return
      }

      if (!getIpInfo) {
        getIpInfo = $api.getIpInfo()
        Vue.prototype.$hasLogin().then(resolve)
        return
      }

      getIpInfo.finally(() => {
        setUserToken()
        resolve()
      })
    })
  }

  Vue.prototype.$goLogin = () => {
    return new Promise((resolve) => {
      Vue.prototype.$hasLogin().then(() => {
        store.state.user.token
          ? resolve()
          : goLogin().then(() => {
            if (!getIpInfo) {
              getIpInfo = $api.getIpInfo()
            }
            getIpInfo.then(() => {
              Vue.prototype.$message.success('登录成功')
              setUserToken()
            }).finally(resolve)
          }).catch(resolve)
      })
    })
  }

  Vue.prototype.$logout = () => {
    return new Promise((resolve) => {
      const signature = getTokenSignature(store.state.ip.info.ip)

      delToken(store.state.ip.info.ip)
      setUserToken()

      !signature ? resolve() : $api.logout(signature).finally(resolve)
    })
  }
}
