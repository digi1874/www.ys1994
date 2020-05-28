<template>
  <div class="play-page">
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>

    <template v-else>
      <div class="card player">
        <div class="vod">
          <h4 class="name">
            <nuxt-link :to="'/detail?id=' + vodDetail.id">
              {{ vodDetail.name }}
            </nuxt-link>
            <span>{{ playUrl.name }}</span>
            <span class="warning">注意：视频来源于互联网，请不要相信视频中的任何信息（特别是广告）</span>
          </h4>

          <no-ssr>
            <UrlPlayer v-if="playType === 2" :url="playUrl.url" />
            <M3u8Player
              v-if="playType === 1"
              :vod-id="vodId"
              :url="playUrl.url"
              :url-id="playUrl.id"
              :next-url-id="nextUrl.id"
              :start-time="playTime"
            />
          </no-ssr>
          <!-- <div class="tool-bar">
            <div>
              hot：{{ urlData.playCount }}
            </div>
            <div class="pointer" :class="{ active: token && isLike }" @click="like">
              收藏：{{ urlData.likeCount }}
            </div>
            <div>
              <no-ssr><icon type="message" /></no-ssr>
              <span>{{ urlData.reply }}</span>
            </div>
          </div> -->
        </div>
        <div class="url-lists">
          <h3>播放列表</h3>
          <div class="tabs">
            <div class="tab" :class="{ active: tab === 1 }" @click="tab=1">
              播放 ①
            </div>
            <div class="tab" :class="{ active: tab === 2 }" @click="tab=2">
              播放 ②
            </div>
          </div>
          <ul v-if="tab === 2" class="urls">
            <li v-for="(item, index) in vodDetail.urls" :key="index">
              <nuxt-link
                :to="{ name: 'play', query: { id: vodDetail.id, urlId: item.id, type: 2 } }"
                :class="{ active: playType === 2 && item.id === playUrl.id }"
                replace
              >
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
          <ul v-if="tab === 1" class="urls">
            <li v-for="(item, index) in vodDetail.m3u8s" :key="index">
              <nuxt-link
                :to="{ name: 'play', query: { id: vodDetail.id, urlId: item.id, type: 1 } }"
                :class="{ active: playType === 1 && item.id === playUrl.id }"
                replace
              >
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
          <nuxt-link
            v-if="playType === tab && nextUrl.id"
            :to="{ name: 'play', query: { id: vodDetail.id, urlId: nextUrl.id, type: playType } }"
            replace
            style="text-align: center"
          >
            播放下一集
          </nuxt-link>
        </div>
      </div>
      <!-- <y-card title="评论" /> -->
    </template>
  </div>
</template>

<script>
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import { mapState } from 'vuex'
import { asyncDataGetVodDetail, handleDBVodData } from '@/db/vodDetail'
import M3u8Player from '@/components/m3u8Player'
import UrlPlayer from '@/components/urlPlayer'

const getPlayUrlAndNextUrl = (vodDetail, query) => {
  let urlList = vodDetail.urls
  if (query.type * 1 === 1) {
    urlList = vodDetail.m3u8s
  }
  const id = query.urlId * 1
  const playUrl = find(urlList, { id }) || urlList[0] || {}
  const nextUrlIndex = findIndex(urlList, { id }) + 1
  const nextUrl = urlList[nextUrlIndex] || {}
  return { playUrl, nextUrl }
}

export default {
  components: {
    M3u8Player,
    UrlPlayer
  },
  asyncData: ctx => asyncDataGetVodDetail(ctx),
  data () {
    return {
      vodId: this.$route.query.id * 1,
      tab: this.$route.query.type * 1,
      playUrl: {},
      nextUrl: {},
      playType: 0,
      urlData: {},
      isLike: false,
      playTime: 0
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    })
  },
  watch: {
    '$route.query' () {
      this.switchPlay()
    }
  },
  beforeMount () {
    this.$hasLogin().then(this.switchPlay)
  },
  mounted () {
    !this.errorMsg && handleDBVodData(this)
  },
  methods: {
    switchPlay () {
      if (this.switchPlay.timer) { clearTimeout(this.switchPlay.timer) }
      if (!this.errorMsg) {
        this.switchPlay.timer = setTimeout(() => {
          this.urlData = {}
          this.playTime = 0
          this.isLike = false

          const { playUrl, nextUrl } = getPlayUrlAndNextUrl(this.vodDetail, this.$route.query)
          const playType = this.$route.query.type * 1

          if (playType === 1) {
            this.$api.getVodM3u8Data(playUrl.id).then(({ data }) => {
              this.urlData = data.vodM3u8Data
              this.playTime = data.play.time
              this.isLike = data.like.state === 1
            }).finally(() => {
              this.playUrl = playUrl
              this.nextUrl = nextUrl
              this.playType = playType
            })
          } else {
            this.playUrl = playUrl
            this.nextUrl = nextUrl
            this.playType = playType
          }
        }, 500)
      }
    },
    like () {
      if (!this.token) {
        this.$goLogin()
        return
      }

      if (this.like.loading) { return }

      if (this.playType === 1) {
        this.like.loading = true
        this.$api.likeVodM3u8(this.playUrl.id).then(({ data }) => {
          const isLike = data === 1
          if (isLike !== this.isLike) {
            this.isLike = isLike
            this.urlData.likeCount += this.isLike ? 1 : -1
          }
          this.$message.success(this.isLike ? '收藏成功' : '取消成功')
        }).finally(() => {
          this.like.loading = false
        })
      }
    }
  },
  head () {
    const { vodDetail, playUrl } = this
    if (!vodDetail) {
      return {}
    }
    return {
      title: `正在播放${vodDetail.name}${playUrl.name || ''}`
    }
  }
}
</script>

<style lang="scss">
.play-page {
  padding: 10px;

  .warning {
    margin-left: 10px;
    font-size: 12px;
    color: red;
  }

  .tool-bar {
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,.1);
    padding: 10px;
    line-height: 34px;

    > * {
      padding: 0 10px;
    }

    > .active {
      color: #859b93;
    }
  }

  .player {
    overflow: hidden;
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    max-height: 98vh;
    min-height: 620px;
    height: 55vw;

    .vod {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;

      .name {
        padding: 10px 20px;
      }
    }
  }

  .url-lists {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 150px;
    background: #222;
    color: #fff;
    user-select: none;

    h3 {
      padding-left: 10px;
      line-height: 28px;
      font-size: 14px;
    }

    .tabs {
      display: flex;
      background: #2a2a2a;
      color: #999;

      .tab {
        flex-grow: 1;
        line-height: 28px;
        text-align: center;
        cursor: pointer;

        &:hover {
          background: rgba(255,255,255,0.1);
        }
      }
      .active {
        background: #111;
        color: #fff;
      }
    }

    .urls {
      overflow-y: auto;
      flex-grow: 1;
      margin-right: -20px;
      padding: 10px 0;
      background: #111;
    }

    a {
      display: block;
      margin-top: 1px;
      padding: 5px 10px;
      color: #999;

      &.active,
      &:hover {
        color: #fff;
        background: rgba(255,255,255,0.3);
      }
    }
  }
}
</style>
