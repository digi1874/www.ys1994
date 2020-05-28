<template>
  <y-card class="last-page" title="最近更新">
    <ListCover :data-list="list.data" />
    <y-pagination :pages="list.pages" :active="list.page" to="/last?page=" />
  </y-card>
</template>

<script>
import { mapState } from 'vuex'
import ListCover from '@/components/list/cover'

export default {
  components: {
    ListCover
  },
  async asyncData ({ $api, query }) {
    const page = query.page * 1 || 1
    await $api.getVodList({ page, size: 27 })
    return {}
  },
  computed: {
    ...mapState({
      list: store => store.vod.list
    })
  },
  watch: {
    '$route.query.page' (val) {
      this.$api.getVodList({ page: val * 1 || 1, size: this.list.size || 27 })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  },
  head () {
    return {
      title: '视频列表'
    }
  }
}
</script>

<style lang="scss">
.last-page {
  margin: 20px;
  .pagination {
    margin-top: 20px;
  }
}
</style>
