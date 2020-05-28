<template>
  <span class="star-bar">
    <no-ssr>
      <span v-for="item in full" :key="`full-${item}`" :style="{ color: gradeColor }" @click="change(item)">
        <icon type="star-full" />
      </span>
      <span v-for="item in (5 - full)" :key="item" :style="{ color: item == 1 && full !== value && gradeColor || '#bbb' }" @click="change(item+full)">
        <icon type="star" />
      </span>
    </no-ssr>
    <span v-show="showValue" :style="{ color: gradeColor }">{{ value }}</span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    edit: {
      type: Boolean,
      default: true
    },
    showValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    gradeColor () {
      return this.$options.filters.gradeColor && this.$options.filters.gradeColor(Math.ceil(this.value))
    },
    full () {
      return Math.floor(this.value)
    }
  },
  methods: {
    change (val) {
      this.edit && this.$emit('input', this.value === val ? 0 : val)
    }
  }
}
</script>

<style lang="scss">
.star-bar {
  display: flex;
  user-select: none;

  &:hover {
    > span {
      display: flex !important;
    }
  }

  > span {
    display: flex;
    padding: 0 2px;
  }
}
</style>
