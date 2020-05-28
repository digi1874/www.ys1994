import { setToken } from '@/utils'

export default function ({ app, store }) {
  if (!process.server) {
    const { router } = app
    router.beforeEach((to, from, next) => {
      if (to.query.jwt) {
        setToken(to.query.jwt)
        delete to.query.jwt
        router.replace(to)
      } else {
        next()
      }
    })
  }
}
