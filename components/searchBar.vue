<template>
  <form class="search-bar" autocomplete="off" @submit.prevent>
    <y-input v-model="kw" :allow-clear="true" placeholder="请输入影片名" @pressEnter="handleSearch">
      <icon slot="prefix" type="search" />
    </y-input>
  </form>
</template>

<script>
export default {
  data () {
    return {
      kw: this.$route.query.kw
    }
  },
  watch: {
    '$route.query.kw' (val) {
      this.kw = val
    }
  },
  methods: {
    handleSearch () {
      if (this.kw) {
        this.$router.push({ path: '/search', query: { kw: this.kw } })
      }
    }
  }
}
</script>
