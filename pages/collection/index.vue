<template>
  <y-card class="collection-list" title="视频集合">
    <CollectionList :more-to="''" />
    <y-pagination v-if="list.count" :pages="list.pages" :active="list.page" to="/collection?page=" />
  </y-card>
</template>

<script>
import { mapState } from 'vuex'
import CollectionList from '@/components/collectionList'

export default {
  components: {
    CollectionList
  },
  async asyncData ({ query, $api }) {
    await $api.getCollectionList({ page: query.page || 1, size: 27 })
    return {}
  },
  computed: {
    ...mapState({
      list: store => store.collection.list
    })
  },
  watch: {
    '$route.query.page' (val) {
      this.$api.getCollectionList({ page: val * 1 || 1, size: this.list.size || 27 })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  },
  head () {
    return {
      title: '视频集合列表'
    }
  }
}
</script>

<style lang="scss">
.collection-list {
  margin: 20px;

  .pagination {
    margin-top: 20px;
  }
}
</style>
