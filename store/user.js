import { grade } from '@/utils'

export const state = () => ({
  token: '',
  info: {}
})

export const mutations = {
  setInfo (state, data) {
    state.info = { ...data, avatar: data.avatar.image, grade: grade(data.playTime) }
  },
  delInfo (state) {
    state.info = {}
  },
  setToken (state, token) {
    state.token = token
  }
}
