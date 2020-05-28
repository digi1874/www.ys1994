<template>
  <div class="url-player">
    <y-loading v-show="loading" />
    <iframe
      v-if="showPlayer"
      v-show="!loading"
      :src="'https://' + url"
      frameborder="0"
      allowfullscreen="true"
      @load="loading=false"
    />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: true,
      showPlayer: true
    }
  },
  watch: {
    url () {
      this.loading = true
      this.showPlayer = false
      this.$nextTick(() => {
        this.showPlayer = true
      })
    }
  }
}
</script>

<style lang="scss">
.url-player {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
