export const state = () => ({
  info: {}
})

export const mutations = {
  setInfo (state, data) {
    state.info = { ...data }
  }
}
