import cloneDeep from 'lodash/cloneDeep'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import find from 'lodash/find'
import { getSessionStorageItem, setSessionStorageItem } from './sessionStorage'

export const storeDefault = () => cloneDeep({
  allList: [],
  list: {},
  allDetail: {},
  detail: {}
})

export const storeMutations = (ssKey) => {
  const detailSSKey = ssKey + 'AllDetail'
  const listSSKey = ssKey + 'AllList'
  return {
    setList (state, data) {
      data.pages = Math.ceil(data.count / data.size)
      state.list = data

      if (process.server) {
        state.allList = [ data ]
      } else {
        // uniqWith 保留前面的
        const allList = [
          data,
          ...state.allList,
          ...getSessionStorageItem(listSSKey) || []
        ]
        state.allList = uniqWith(allList, (arrVal, othVal) => isEqual(arrVal.params, othVal.params))
        setSessionStorageItem(listSSKey, state.allList)
      }
    },
    getList (state, params) {
      const list = find(state.allList, item => isEqual(item.params, params)) || {}
      if (list.count) {
        state.list = list
      } else {
        state.list = find(getSessionStorageItem(listSSKey), item => isEqual(item.params, params)) || {}
      }
    },
    removeAllList (state) {
      state.allList = []
      state.list = {}
      setSessionStorageItem(listSSKey, [])
    },

    setDetail (state, data) {
      state.detail = data
      state.allDetail[data.id] = data

      if (!process.server) {
        state.allDetail = { ...getSessionStorageItem(detailSSKey), ...state.allDetail }
        setSessionStorageItem(detailSSKey, state.allDetail)
      }
    },
    getDetail (state, id) {
      state.detail = state.allDetail[id] || (getSessionStorageItem(detailSSKey) || {})[id] || {}
    },
    removeDetail (state, id) {
      const allDetail = { ...getSessionStorageItem(detailSSKey), ...state.allDetail }
      delete allDetail[id]
      state.allDetail = allDetail
      setSessionStorageItem(detailSSKey, allDetail)
    },
    removeAllDetail (state) {
      state.allDetail = {}
      state.detail = {}
      setSessionStorageItem(detailSSKey, {})
    }
  }
}
