<template>
  <div class="keyword-list-page">
    <div class="card keyword-list">
      <div class="head">
        <span>关键字</span>
        <span>搜索量</span>
      </div>
      <div v-for="item in list.data" :key="item.text" class="item">
        <nuxt-link :to="'/search?kw=' + item.text">
          {{ item.text }}
        </nuxt-link>
        <span class="num">
          {{ item.num }}
        </span>
      </div>
    </div>
    <y-pagination :pages="list.pages" :active="list.page" to="/keyword?page=" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  async asyncData ({ $api, query }) {
    const page = query.page * 1 || 1
    await $api.getKeywordList({ page })
    return {}
  },
  computed: {
    ...mapState({
      list: store => store.keyword.list
    })
  },
  watch: {
    '$route.query.page' (val) {
      const page = val * 1 || 1
      this.$api.getKeywordList({ page })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  }
}
</script>

<style lang="scss">
.keyword-list-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;

  .keyword-list {
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;

      span {
        width: 150px;
        text-align: center;
        font-weight: bold;
      }
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #ededed;
    }

    a {
      flex-grow: 1;
      border-right: 1px solid #ededed;
      padding: 10px 20px;
    }

    .num {
      padding: 0 20px;
      flex-shrink: 0;
      width: 150px;
      text-align: center;
    }
  }
}
</style>
