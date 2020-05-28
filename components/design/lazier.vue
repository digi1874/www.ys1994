<template>
  <span class="lazier">
    <no-ssr><y-loading v-if="loading" /></no-ssr>
    <img
      v-if="isShow && src"
      v-show="!loading"
      :src="src"
      :alt="alt"
      @error="error"
      @load="load"
    >
    <icon v-if="!isShow && !loading" type="picture" />
  </span>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: process.server,
      loading: true
    }
  },
  mounted () {
    if (this.src) {
      window.addEventListener('scroll', this.handleScroll)
      this.handleScroll()
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    error () {
      this.isShow = false
      this.loading = false
    },
    load () {
      this.loading = false
    },
    handleScroll () {
      const { top, left } = this.$el.getBoundingClientRect()

      if (top > -this.$el.clientHeight && top < window.innerHeight && left > -this.$el.clientWidth && left < window.innerWidth) {
        this.isShow = true
        this.loading = true
        window.removeEventListener('scroll', this.handleScroll)
      }
    }
  }
}
</script>

<style lang="scss">
.lazier {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }

  .icon-picture {
    color: #999;
    font-size: 100px;
  }
}
</style>
