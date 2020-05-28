<template>
  <div>
    <p v-if="!list.length">
      暂无数据
    </p>
    <div v-for="(item, index) in list" :key="index">
      <CommentDetail :detail="item" type="list" />
    </div>
  </div>
</template>

<script>
import CommentDetail from './commentDetail'

export default {
  components: {
    CommentDetail
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
