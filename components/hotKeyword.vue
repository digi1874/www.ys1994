<template>
  <y-card title="热门搜索" class="hot-keyword">
    <div class="list">
      <nuxt-link v-for="(item, index) in list.data" :key="index" :to="'/search?kw=' + item.text" :title="item.text">
        {{ item.text }}
      </nuxt-link>
      <nuxt-link to="/keyword" class="more">
        更多
      </nuxt-link>
    </div>
  </y-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      list: store => store.keyword.list
    })
  }
}
</script>

<style lang="scss">
.hot-keyword {
  width: 200px;
  flex-shrink: 0;

  a {
    display: block;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    padding: 0 10px;
    line-height: 28px;
    background-color: #859b93;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .more {
    background-color: #fff;
    color: #333;
    text-align: center;
  }
}
</style>
