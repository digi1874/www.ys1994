<template>
  <a class="user-link" :style="{ color: gradeColor }">{{ user.name }}</a>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      user: this.detail
    }
  },
  computed: {
    gradeColor () {
      return this.$options.filters.gradeColor(this.user.grade) || ''
    }
  },
  mounted () {
    this.$api.getUser(this.detail.id).then((data) => {
      this.user = {
        ...this.detail,
        ...data
      }
    })
  }
}
</script>

<style lang="scss">
.user-link:hover {
  color: #1890ff !important;
}
</style>
