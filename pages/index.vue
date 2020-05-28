<template>
  <div class="index-page">
    <no-ssr>
      <y-card v-if="playList && playList.length" title="播放记录">
        <ListCover
          :data-list="playList"
          :wrap="false"
          detail-path="/play?type=1&id="
          :more-to="'/playLog?page=1'"
        />
      </y-card>
    </no-ssr>
    <div class="flex">
      <y-card title="最近更新" class="flex-grow">
        <ListCover :data-list="vodList" :more-to="'/last?page=1'" />
      </y-card>
      <HotKeyword />
    </div>
    <y-card title="热门视频集合">
      <CollectionList />
    </y-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListCover from '@/components/list/cover'
import HotKeyword from '@/components/hotKeyword'
import CollectionList from '@/components/collectionList'

export default {
  components: {
    ListCover,
    HotKeyword,
    CollectionList
  },
  async asyncData ({ $axios, store, $api }) {
    await $api.getKeywordList({ page: 1 })
    await $api.getVodList({ page: 1, size: 23 })
    await $api.getCollectionList({ page: 1, size: 27 })
    return {}
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      vodList: store => store.vod.list.data,
      playList: store => store.playVod.list.data
    })
  },
  watch: {
    token () {
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
      this.$api.getPlayVodList({ page: 1, size: 8 }).finally(() => {
        this.getPlayLog.loading = false
      })
    }
  },
  head () {
    return {
      title: '首页'
    }
  }
}
</script>

<style lang="scss">
.index-page {
  padding: 10px;

  .card {
    margin-bottom: 20px;
  }
}
</style>
