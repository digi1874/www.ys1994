export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'zh'
    },
    title: '',
    titleTemplate: (titleChunk) => {
      return titleChunk ? titleChunk + '-影视1994' : '影视1994'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '免费电影观看,电影观看,最新电影' },
      { hid: 'description', name: 'description', content: '最好的在线电影网，分享最新电影，高清电影、综艺、动漫、电视剧等在线观看！' }
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preload', as: 'style', href: 'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css' },
      { rel: 'stylesheet', href: 'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css' },
      { rel: 'preload', as: 'script', href: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js' }
    ],
    script: [
      { src: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~/plugins/router.js',
      ssr: false
    },
    '~/plugins/design.js',
    '~/plugins/axios.js',
    '~/plugins/login.js',
    '~/plugins/api.js',
    '~/plugins/filters.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '~/modules/api/module.js'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    port: process.env.NODE_ENV === 'development' ? 9011 : 9010
  }
}
