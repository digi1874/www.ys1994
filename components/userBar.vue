<template>
  <div class="user-bar" :style="{ color: gradeColor }">
    <div class="avatar">
      <no-ssr><icon v-if="!user.avatar" type="user" /></no-ssr>
      <img v-if="user.avatar" :src="user.avatar | imageUrl">
    </div>
    <div class="name">
      {{ user.name || '用户' + user.id }}
    </div>
  </div>
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
.user-bar {
  display: flex;
  align-items: center;

  &:hover {
    color: #1890ff !important;
  }

  .avatar {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 34px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .name {
    margin-left: 10px;
    font-size: 18px;

  }
}
</style>
