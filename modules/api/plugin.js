export default (ctx, inject) => {
  const api = {}
  ctx.$api = api
  inject('api', api)
}
