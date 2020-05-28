<template>
  <div class="m3u8-player">
    <div v-show="playError" class="play-error">
      <p>
        无法连接到{{ urlHost }}服务器
      </p>
      <p>
        可能你所在的网络DNS无法解析{{ urlHost }}
      </p>
      <p>稍后重试，或是绑定hosts</p>
      <a :href="'https://site.ip138.com/' + urlHost" target="_blank">点击查看{{ urlHost }}的IP</a>
      <a href="https://github.com/oldj/SwitchHosts/releases" target="_blank">下载SwitchHosts</a>
      <a href="https://www.jianshu.com/p/7fa374dc012f" target="_blank">SwitchHosts使用技巧</a>
    </div>
    <div v-show="!playError" class="m3u8-player-content">
      <div id="vodPlayer" tabindex="1" @keydown.prevent="handleKeydown" />
      <y-loading v-show="loading" />
      <!-- <div class="tool-bar">
        <div class="barrage">
          <span>123条弹幕</span>
          <span class="pointer">开关</span>
          <span class="pointer">设置</span>
          <y-input v-model="barrage" placeholder="请输入弹幕内容" @pressEnter="submitBarrage">
            <span slot="suffix" class="pointer" @click="submitBarrage">发送</span>
          </y-input>
        </div>
        <label class="pointer">
          <input v-model="autoPlay" type="checkbox">
          自动播放
        </label>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils'

const AUTO_PLAY_LS_NAME = 'auto_play'

export default {
  props: {
    vodId: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    urlId: {
      type: Number,
      default: 0
    },
    nextUrlId: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      player: undefined,
      autoPlay: getLocalStorageItem(AUTO_PLAY_LS_NAME) || false,
      playError: false,
      loading: false,
      barrage: ''
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    }),
    urlHost () {
      return this.url.replace(/\/.+/, '')
    }
  },
  watch: {
    autoPlay (val) {
      setLocalStorageItem(AUTO_PLAY_LS_NAME, val)
    },
    urlId (newVal, oldVal) {
      this.addPlayLogHandle(oldVal)
      this.setAliplayer()
    }
  },
  beforeCreate () {
    this.$hasLogin()
  },
  mounted () {
    this.setAliplayer()
    window.addEventListener('beforeunload', () => this.addPlayLogHandle())
  },
  beforeDestroy () {
    this.addPlayLogHandle()
    this.removeAliplayer()
    window.removeEventListener('beforeunload', this.addPlayLogHandle)
  },
  methods: {
    ...mapMutations({
      removeAllPlayList: 'playVod/removeAllList'
    }),
    setAliplayer () {
      this.loading = true

      if (this.setAliplayer.autoPlayTimer) { clearTimeout(this.setAliplayer.autoPlayTimer) }

      const source = 'https://' + this.url

      if (this.player) {
        this.player.pause()
        this.player.loadByUrl(source)
        return
      }

      this.player = new window.Aliplayer({
        id: 'vodPlayer',
        source,
        autoplay: false,
        preload: true,
        height: '100%'
      })
      this.player.on('ready', () => {
        this.loading = false
        this.player.seek(this.startTime)
        this.setAliplayer.autoPlayTimer = setTimeout(() => {
          this.autoPlay && this.player.play()
        }, 1000)
      })
      this.player.on('ended', () => {
        this.autoPlay &&
        this.nextUrlId &&
        this.$router.replace({ name: 'play', query: { id: this.vodId, urlId: this.nextUrlId, type: 1 } })
      })
      this.player.on('error', (e) => {
        this.playError = true
      })
    },
    removeAliplayer () {
      if (this.player) {
        this.player.pause()
        this.player.dispose()
      }
    },
    handleKeydown ({ keyCode }) {
      if (!this.player) { return }
      if (keyCode === 32) {
        this.changePlay()
      } else if (keyCode === 37) {
        this.forwardOrBack(-5)
      } else if (keyCode === 39) {
        this.forwardOrBack(5)
      } else if (keyCode === 38) {
        this.upOrDownVolume(0.1)
      } else if (keyCode === 40) {
        this.upOrDownVolume(-0.1)
      } else if (keyCode === 13) {
        this.player.fullscreenService.getIsFullScreen()
          ? this.player.fullscreenService.cancelFullScreen()
          : this.player.fullscreenService.requestFullScreen()
      }
    },
    changePlay () {
      const status = this.player.getStatus()
      if (status === 'playing') {
        this.player.pause()
      } else if (status === 'pause') {
        this.player.play()
      }
    },
    forwardOrBack (time) {
      this.player.seek(this.player.getCurrentTime() + time)
    },
    upOrDownVolume (volume) {
      volume = this.player.getVolume() + volume
      this.player.setVolume(volume > 1 ? 1 : volume < 0 ? 0 : volume)
    },
    addPlayLogHandle (urlId) {
      if (!this.token || !this.player || this.playError) {
        return
      }

      const time = this.player.getCurrentTime()

      time &&
      this.$api.savePlayM3u8({
        m3u8Id: urlId || this.urlId,
        time: Math.floor(time) || 1
      }).then(this.removeAllPlayList)
    },
    submitBarrage () {
      window.console.log(this.barrage)
      this.barrage = ''
    }
  }
}
</script>

<style lang="scss">
.m3u8-player {
  position: relative;
  flex-grow: 1;

  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  #vodPlayer {
    outline: 0;
  }

  .play-error {
    line-height: 32px;
    text-align: center;
    color: red;
  }

  .barrage {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding-left: 0;

    > * {
      padding: 0 10px;
    }

    .input {
      flex-grow: 1;
    }
  }
}
.m3u8-player-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
