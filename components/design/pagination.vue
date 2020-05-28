<template>
  <ul class="pagination">
    <template v-if="to">
      <li v-if="active > 6" class="item">
        <nuxt-link :to="to + 1">
          第一页
        </nuxt-link>
      </li>
      <li v-if="active > 1" class="item">
        <nuxt-link :to="to + (active - 1)">
          上页
        </nuxt-link>
      </li>
      <li
        v-for="item in pageList"
        :key="item"
        :class="{ active: item==active }"
        class="item"
      >
        <nuxt-link :to="to + item">
          {{ item }}
        </nuxt-link>
      </li>
      <li v-if="active < pages" class="item">
        <nuxt-link :to="to + (active + 1)">
          下页
        </nuxt-link>
      </li>
      <li v-if="active != pages" class="item">
        <nuxt-link :to="to + pages">
          最后一页
        </nuxt-link>
      </li>
    </template>

    <template v-else>
      <li v-if="active > 6" class="item" @click.capture="handleChange(1)">
        <span class="link">
          第一页
        </span>
      </li>
      <li v-if="active > 1" class="item" @click.capture="handleChange(active - 1)">
        <span class="link">
          上页
        </span>
      </li>
      <li
        v-for="item in pageList"
        :key="item"
        :class="{ active: item==active }"
        class="item"
        @click.capture="handleChange(item)"
      >
        <span class="link">
          {{ item }}
        </span>
      </li>
      <li v-if="active < pages" class="item" @click.capture="handleChange(active + 1)">
        <span class="link">
          下页
        </span>
      </li>
      <li v-if="active != pages" class="item" @click.capture="handleChange(pages)">
        <span class="link">
          最后一页
        </span>
      </li>
    </template>

    <li class="item">
      <input v-model="page" :max="pages" min="1" type="number" @keyup.enter="toNextPage">
    </li>
    <li class="item" @click="toNextPage">
      <span class="link">跳转</span>
    </li>
    <li class="item">
      <span>共{{ pages }}页</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      default: 0
    },
    active: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: '',
      pageList: []
    }
  },
  watch: {
    pages () {
      this.handlePageList()
    },
    active () {
      this.handlePageList()
    }
  },
  created () {
    this.handlePageList()
  },
  methods: {
    toNextPage (e) {
      const page = this.page < 1 ? 1 : this.page > this.pages ? this.pages : this.page
      this.page = Math.floor(page)
      this.to ? this.$router.push({ path: this.to + Math.floor(this.page) }) : this.handleChange(this.page)
    },
    handlePageList () {
      let pageList = []
      let maxPage, minPage

      maxPage = this.active > 6 ? this.active + 4 : 10
      maxPage = maxPage > this.pages ? this.pages : maxPage
      minPage = maxPage - 9
      minPage = minPage < 1 ? 1 : minPage

      for (let i = minPage; i <= maxPage; i++) {
        pageList = [ ...pageList, i ]
      }
      this.pageList = pageList
    },
    handleChange (page) {
      if (this.active !== page) {
        this.$emit('change', page)
      }
    }
  }
}
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: center;

  .item {
    display: flex;
    align-items: stretch;
    border-top: 1px solid #4a444b;
    border-right: 1px solid #4a444b;
    border-bottom: 1px solid #4a444b;
    height: 43px;
    background-color: #859b93;
    color: #333;

    &.active {
      background-color: #4a444b;
      a {
        color: #fff;
      }
    }

    &:first-child {
      border-radius: 5px 0 0 5px;
      border-left: 1px solid #4a444b;
    }

    &:last-child {
      border-radius: 0 5px 5px 0;
    }

    & > a,
    & > span {
      flex-grow: 1;
      display: flex;
      align-items: center;
      padding: 0 13px;
    }
  }

  input {
    height: 41px;
    line-height: 41px;
    text-align: center;
    color: #333;
    background-color: #fff;
  }
}
</style>
