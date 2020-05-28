import Vue from 'vue'
import forEach from 'lodash/forEach'
import { USER, VOD, ACCOUNT } from '@/dict'
import { formatDate } from '@/utils'

export default function ({ isDev }) {
  const API_BASE_URL = isDev ? 'http://dev.api.ys1994.nl/' : 'https://api.ys1994.nl/'
  forEach({
    imageUrl: value => value && !/^https?:\/\//i.test(value) ? API_BASE_URL + 'user/image/' + value : value,
    accountHref: path => path && ACCOUNT.WEB_BASE_URL + path,
    httpsUrl: value => value && !isDev ? value.replace(/^https?/i, 'https') : value,
    vodType: value => VOD.TYPE_TEXT[value] || value,
    gradeColor: value => value && '#' + USER.GRADE_COLOR[value],
    time: second => second ? `${Math.floor(second / 60)}分${second % 60}秒` : '0秒',
    formatDate: unix => unix && formatDate(unix * 1000)
  }, (filter, key) => {
    Vue.filter(key, (data, ...agm) => filter(data, ...agm))
  })
}
