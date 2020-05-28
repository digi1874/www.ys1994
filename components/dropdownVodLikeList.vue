<template>
  <div @mouseenter="getVodLikeList" @mouseleave="stopGetVodLikeList">
    <y-dropdown>
      <span class="header-item">动态</span>
      <template v-slot:overlay>
        <y-menu>
          <y-menu-item v-if="!token">
            <div class="link" @click="$goLogin">
              登录后查看动态
            </div>
          </y-menu-item>

          <y-menu-item v-else-if="loading">
            <div class="relative" style="height:50px">
              <y-loading />
            </div>
          </y-menu-item>

          <template v-else-if="likeVods.length">
            <y-menu-item v-for="item in likeVods" :key="item.id">
              <nuxt-link :to="'/detail?id=' + item.id" class="vod-like-list">
                <img :src="item.pic | imageUrl | httpsUrl" class="pic" @error="e => e.target.style.display='none'">
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.serial }}</p>
                </div>
              </nuxt-link>
            </y-menu-item>
            <y-menu-item>
              <a :href="'likeVodList?jwt=' + token | accountHref" target="_blank" class="text-center" style="display:block;">
                更多
              </a>
            </y-menu-item>
          </template>

          <y-menu-item v-else-if="loading === false">
            暂无数据
          </y-menu-item>
        </y-menu>
      </template>
    </y-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      loading: 0,
      likeVods: []
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    })
  },
  watch: {
    token (val) {
      if (!val) {
        this.loading = 0
        this.likeVods = []
      }
    }
  },
  methods: {
    getVodLikeList () {
      if (!this.token || this.loading || this.likeVods.length) { return }

      clearTimeout(this.getVodLikeList.timer)

      this.getVodLikeList.timer = setTimeout(() => {
        this.loading = true
        this.$api.getLikeVodList({ size: 5 }).then(({ data }) => {
          this.likeVods = data.data
        }).finally(() => {
          this.loading = false
        })
      }, 500)
    },
    stopGetVodLikeList () {
      clearTimeout(this.getVodLikeList.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.vod-like-list {
  display: flex;
  align-items: center;
  white-space: nowrap;
  line-height: 26px;
  text-align-last: left;

  .pic {
    margin-right: 10px;
    width: 50px;
    height: 66px;
    background-color: rgba(0,0,0,.2);
  }
}
</style>
