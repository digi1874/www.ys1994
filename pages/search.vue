<template>
  <div class="search-page">
    <y-card class="vod-list" :title="'搜索“' + $route.query.kw + '”结果'">
      <y-loading v-show="loading" />
      <ListCover :data-list="list.data" />
      <y-pagination v-if="list.count" :pages="list.pages" :active="list.page" :to="'/search?kw=' + $route.query.kw + '&page='" />
      <p v-if="!loading && list.data && !list.data.length">
        暂无数据
      </p>
    </y-card>
    <HotKeyword />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListCover from '@/components/list/cover'
import HotKeyword from '@/components/hotKeyword'

export default {
  components: {
    ListCover,
    HotKeyword
  },
  async asyncData ({ $api, query, store }) {
    await $api.getKeywordList({ page: 1 })

    const page = query.page * 1 || 1
    await $api.getVodList({ page, size: 27, filter: { name: query.kw } })
    return {}
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      list: store => store.vod.list
    })
  },
  watch: {
    '$route.query.page' (page) {
      this.getList(page * 1)
    },
    '$route.query.kw' (val) {
      val && this.getList(1, 1)
    }
  },
  beforeMount () {
    this.list.page === 1 && this.getList(1, 1)
  },
  methods: {
    getList (page, sync) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      const params = { page, size: this.list.size || 27, filter: { name: this.$route.query.kw } }
      if (sync) {
        params.sync = 1
      }
      this.loading = true
      this.$api.getVodList(params).then(() => {
        this.loading = false
      })
    }
  },
  head () {
    const { kw } = this.$route.query
    return {
      title: `${kw}_视频在线观看-视频搜索`,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: `视频搜索,全网视频搜索,高清视频,在线视频`
        },
        {
          hid: 'description',
          name: 'description',
          content: `影视1994视频搜索“${kw}”搜索结果页面为您提供最新最全的“${kw}”相关视频的搜索和在线观看服务。`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.search-page {
  display: flex;
  align-items: flex-start;
  padding: 10px;

  .vod-list {
    position: relative;
    flex-grow: 1;
  }

  .pagination {
    margin-top: 20px;
  }
}
</style>
