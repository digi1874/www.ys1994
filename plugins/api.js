import forEach from 'lodash/forEach'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import cloneDeep from 'lodash/cloneDeep'
import { USER, VOD } from '@/dict'
import { dbGetUser, dbAddUser } from '@/db'
import { grade } from '@/utils'

export default function ({ $api, $axios, store }) {
  const defaultLikeData = () => ({
    createdTime: Math.floor(new Date() / 1000),
    like: 0,
    dislike: 0,
    grade: store.state.user.info.grade,
    userId: store.state.user.info.id,
    userLike: {
      state: 0
    }
  })

  function get (url, mutation, handleData) {
    return $axios.$get(url).then((res) => {
      if (handleData) {
        res.data = handleData(res.data)
      }
      store.commit(mutation, res.data)
      return res
    })
  }

  function commitGet (key, type, url, params, handleData) {
    const Type = capitalize(type)
    return new Promise((resolve, reject) => {
      const fetch = () => {
        params = { ...params }
        $axios.$get(url, { params }).then(({ data }) => {
          if (handleData) {
            data = handleData(data)
          }
          store.commit(`${key}/set${Type}`, { ...data, params })
          resolve()
        }).catch(reject)
      }

      if (process.server) {
        fetch()
      } else {
        store.commit(`${key}/get${Type}`, params)

        if (!isEmpty(store.state[key][type])) {
          resolve()
        } else {
          if (params.sync) {
            const p = { ...params }
            delete p.sync
            store.commit(`${key}/get${Type}`, p)
          }
          fetch()
        }
      }
    })
  }

  // vod
  $api.getKeywordList = params => commitGet('keyword', 'list', `${VOD.API_BASE_URL}keyword`, params)
  $api.getVodList = params => commitGet('vod', 'list', `${VOD.API_BASE_URL}list`, params)
  $api.getVodDetail = id => $axios.$get(`${VOD.API_BASE_URL}detail/${id}`)

  // login
  $api.getIpInfo = () => get('login/ip/info', 'ip/setInfo')
  $api.logout = signature => $axios.$post('login/logout/' + signature)

  // user
  $api.getMyInfo = () => get('user/info', 'user/setInfo')
  $api.searchUser = params => commitGet('userSearch', 'list', 'user/search', params)
  $api.getLikeVodList = params => $axios.$get('user/like/vod', { params })
  $api.likeVod = vodID => $axios.$post(`user/like/vod`, { vodID })
  $api.likeVodM3u8 = vodM3u8Id => $axios.$post(`user/like/vodM3u8`, { vodM3u8Id })
  $api.getVodData = id => $axios.$get(`user/vodData/${id}`)
  $api.getVodM3u8Data = id => $axios.$get(`user/vodM3u8Data/${id}`)
  $api.getCollectionList = params => commitGet('collection', 'list', `${USER.API_BASE_URL}share/vodCollection`, params)
  $api.getCollectionDetail = id => commitGet('collection', 'detail', `${USER.API_BASE_URL}share/vodCollection/${id}`, id * 1)
  $api.getCollectionVodList = (id, params) => commitGet('collectionVod', 'list', `${USER.API_BASE_URL}vodCollection/${id}/vod`, { ...params, collectionId: id })
  $api.isLikeCollection = id => $axios.$get(`user/isLike/vodCollection/${id}`)
  $api.likeCollection = id => $axios.$post(`user/like/vodCollection`, { vodCollectionId: id * 1 })
  $api.saveCollectionComment = data => $axios.$post('user/vodCollectionComment', data).then((res) => {
    const { list } = store.state.collectionComment
    if (list.data && store.state.user.info.id) {
      store.commit('collectionComment/setList', {
        ...list,
        count: list.count + 1,
        data: [
          {
            ...data,
            ...defaultLikeData(),
            id: res.data
          },
          ...list.data
        ]
      })
    }
  })
  $api.getCollectionCommentList = params => commitGet('collectionComment', 'list', `${USER.API_BASE_URL}vodCollectionComment`, params)
  $api.likeCollectionComment = ({ vodCollectionCommentId, state }) => $axios.$post('user/like/vodCollectionComment', { vodCollectionCommentId, state }).then(() => {
    store.commit('collectionComment/like', { id: vodCollectionCommentId, state })
  })
  $api.getPlayVodList = params => commitGet('playVod', 'list', 'user/play/vod', params, (data) => {
    forEach(data.data, (item, index) => {
      data.data[index] = {
        ...item.vod,
        playTime: item.time,
        m3u8: item.m3u8
      }
    })
    return data
  })
  $api.savePlayM3u8 = data => $axios.$post('user/play/vod', data)
  $api.saveVodComment = data => $axios.$post('user/vodComment', data).then((res) => {
    const list = cloneDeep(store.state.comment.list)
    if (list.data && store.state.user.info.id) {
      const index = findIndex(list.data, { id: res.data })
      if (index > -1) {
        list.data[index] = {
          ...list.data[index],
          ...data
        }
      } else {
        ++list.count
        list.data = [
          {
            ...data,
            ...defaultLikeData(),
            id: res.data
          },
          ...list.data
        ]
      }
      store.commit('comment/setList', list)
      return res
    }
  })
  $api.getCommentList = params => commitGet('comment', 'list', `${USER.API_BASE_URL}vodComment`, params)
  $api.getCommentDetail = id => commitGet('comment', 'detail', `${USER.API_BASE_URL}vodComment/${id}`, id * 1)
  $api.likeVodComment = ({ vodCommentId, state }) => $axios.$post('user/like/vodComment', { vodCommentId, state }).then(() => {
    store.commit('comment/like', { id: vodCommentId, state })
  })
  $api.saveVodCommentReply = data => $axios.$post('user/vodCommentReply', data).then((res) => {
    const { list } = store.state.commentReply
    if (list.data && store.state.user.info.id) {
      store.commit('commentReply/setList', {
        ...list,
        count: list.count + 1,
        data: [
          {
            ...data,
            ...defaultLikeData(),
            id: res.data
          },
          ...list.data
        ]
      })
    }
  })
  $api.getCommentReplyList = params => commitGet('commentReply', 'list', `${USER.API_BASE_URL}vodCommentReply`, params)
  $api.likeVodCommentReply = ({ vodCommentReplyId, state }) => $axios.$post('user/like/vodCommentReply', { vodCommentReplyId, state }).then(() => {
    store.commit('commentReply/like', { id: vodCommentReplyId, state })
  })

  function handleGetUser (id, resolve) {
    clearTimeout(handleGetUser.timer)

    handleGetUser.items.push({ id, resolve })

    handleGetUser.timer = setTimeout(() => {
      const items = handleGetUser.items
      handleGetUser.items = []

      $axios.$get('user/search', {
        params: {
          size: 9999,
          filter: { ids: uniq(map(items, item => item.id)) }
        }
      }).then(({ data }) => {
        const list = map(data.data, item => ({ ...item, avatar: item.avatar.image }))
        forEach(items, (item) => {
          let user = find(list, { id: item.id })
          if (user) {
            user = {
              ...user,
              grade: grade(user.playTime)
            }
            dbAddUser(user)
          }
          item.resolve(user)
        })
      })
    }, 1000)
  }

  handleGetUser.items = []

  $api.getUser = (id) => {
    return new Promise((resolve) => {
      dbGetUser(id).then(resolve).catch(() => {
        handleGetUser(id, resolve)
      })
    })
  }
}
