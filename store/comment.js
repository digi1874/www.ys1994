import find from 'lodash/find'
import { storeDefault, storeMutations, handleLikeData } from '@/utils'

export const state = storeDefault

export const mutations = {
  ...storeMutations('comment'),
  like (state, data) {
    const item = find(state.list.data, { id: data.id })
    if (item && item.userLike.state !== data.state) {
      handleLikeData(item, data.state)
      state.list.data = [...state.list.data]
    }

    if (state.detail.id === data.id) {
      handleLikeData(state.detail, data.state)
    }
  }
}
