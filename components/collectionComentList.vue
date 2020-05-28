<template>
  <div>
    <p v-if="!list.length">
      暂无数据
    </p>
    <div v-for="(item, index) in list" :key="index">
      <CollectionComentDetail :detail="item" type="list" />
    </div>
  </div>
</template>

<script>
import CollectionComentDetail from './collectionComentDetail'

export default {
  components: {
    CollectionComentDetail
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
