<template>
  <div>
    <div v-if="!token" class="header-item" @click="$goLogin">
      登录
    </div>

    <y-dropdown v-else class="text-center">
      <div class="header-item">
        <div class="avatar">
          <icon v-if="!userInfo.avatar" type="user" />
          <img v-else :src="userInfo.avatar | imageUrl">
        </div>
      </div>
      <template v-slot:overlay>
        <y-menu>
          <y-menu-item v-if="!userInfo.id">
            <y-loading />
          </y-menu-item>

          <template v-else>
            <y-menu-item>
              <a :href="accountHref + 'info?jwt=' + token" target="_blank" class="name" :style="{ color: gradeColor }">
                {{ userInfo.name || '用户' + userInfo.id }}
              </a>
            </y-menu-item>
            <y-menu-item>
              <a :href="accountHref + '?jwt=' + token" target="_blank">
                个人中心
              </a>
            </y-menu-item>
            <y-menu-item>
              <a :href="accountHref + 'vodPlayList?jwt=' + token" target="_blank">
                播放记录
              </a>
            </y-menu-item>
            <y-menu-item>
              <a :href="accountHref + 'likeVodList?jwt=' + token" target="_blank">
                我的收藏
              </a>
            </y-menu-item>
            <y-menu-item>
              <a :href="accountHref + 'vodCollection/list?jwt=' + token" target="_blank">
                我的专辑
              </a>
            </y-menu-item>
            <y-menu-item>
              <a :href="accountHref + 'vodCollection/like/list?jwt=' + token" target="_blank">
                收藏专辑
              </a>
            </y-menu-item>
            <y-menu-item>
              <div class="link" @click="$logout">
                退出
              </div>
            </y-menu-item>
          </template>
        </y-menu>
      </template>
    </y-dropdown>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { ACCOUNT } from '@/dict'

export default {
  data () {
    return {
      accountHref: ACCOUNT.WEB_BASE_URL
    }
  },
  computed: {
    ...mapState({
      userInfo: store => store.user.info,
      token: store => store.user.token
    }),
    gradeColor () {
      return this.$options.filters.gradeColor(this.userInfo.grade)
    }
  },
  watch: {
    token (val) {
      val ? this.getInfo() : this.delInfo()
    }
  },
  beforeMount () {
    this.$hasLogin()
  },
  methods: {
    ...mapMutations({
      delInfo: 'user/delInfo'
    }),
    getInfo () {
      if (this.getInfo.loading) {
        return
      }

      this.getInfo.loading = true

      this.token &&
      !this.userInfo.id &&
      this.$api.getMyInfo().finally(() => {
        this.getInfo.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 20px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
.name {
  display: block;
  font-weight: bold;
  font-size: 14px;
}
</style>
