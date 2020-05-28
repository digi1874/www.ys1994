<template>
  <y-card title="播放记录" style="margin:20px;">
    <span v-if="!token" class="link" @click="$goLogin">请登录</span>
    <template v-else>
      <ListCover :data-list="list.data" detail-path="/play?type=1&id=" />
      <y-pagination :pages="list.pages" :active="list.page" to="/playLog?page=" />
    </template>
  </y-card>
</template>

<script>
import { mapState } from 'vuex'
import ListCover from '@/components/list/cover'

export default {
  components: {
    ListCover
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      list: store => store.playVod.list
    }),
    page () {
      return this.$route.query.page * 1
    }
  },
  watch: {
    token () {
      this.getPlayLog()
    },
    page (val) {
      this.getPlayLog()
    }
  },
  mounted () {
    this.$hasLogin().then(this.getPlayLog)
  },
  methods: {
    getPlayLog () {
      if (this.getPlayLog.loading || !this.token) { return }

      this.getPlayLog.loading = true
      this.$api.getPlayVodList({ page: this.page, size: 27 }).finally(() => {
        this.getPlayLog.loading = false
      })
    }
  }
}
</script>
