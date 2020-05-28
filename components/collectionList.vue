<template>
  <div>
    <p v-if="!list.count">
      暂无数据
    </p>
    <ListCover
      v-else
      :data-list="list.data"
      :detail-path="'/collection/detail?page=1&cPage=1&id='"
      :more-to="moreTo"
      @itemClickCapture="item => setDetail(item)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ListCover from './list/cover'

export default {
  components: {
    ListCover
  },
  props: {
    moreTo: {
      type: String,
      default: '/collection?page=1'
    }
  },
  computed: {
    ...mapState({
      list: store => store.collection.list
    })
  },
  methods: {
    ...mapMutations({
      setDetail: 'collection/setDetail'
    })
  }
}
</script>
