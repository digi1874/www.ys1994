export const state = () => ({
  allList: {},
  list: {}
})

export const mutations = {
  setList (state, data) {
    data.pages = Math.ceil(data.count / data.size)
    state.allList[`${data.kw}_${data.page}`] = data
    state.list = data
  },
  getList (state, data) {
    state.list = state.allList[`${data.kw}_${data.page}`] || {}
  }
}
