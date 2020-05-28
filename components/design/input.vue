<template>
  <div class="input">
    <slot name="prefix" />
    <input
      ref="input"
      v-model="val"
      :type="type"
      :placeholder="placeholder"
      :autofocus="autofocus"
      @keyup.enter="pressEnter"
      @blur="blur"
    >
    <span v-show="allowClear && val" class="clear" @click="clear">
      <icon type="close" />
    </span>
    <slot name="suffix" />
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: [ String, Number ],
      default: ''
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  watch: {
    value (val) {
      this.val = val
    },
    val (val) {
      this.$emit('input', val)
    },
    autofocus (val) {
      val && this.$refs.input.focus()
    }
  },
  methods: {
    pressEnter () {
      this.$emit('pressEnter')
    },
    clear () {
      this.val = ''
      this.$refs.input.focus()
    },
    blur () {
      this.$emit('blur')
    }
  }
}
</script>

<style lang="scss">
.input {
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 34px;
  padding: 0 10px;
  width: 250px;
  height: 34px;
  line-height: 34px;
  background-color: #859b93;
  color: #ddd;

  input {
    padding-right: 5px;
    padding-left: 5px;
    height: 100%;
  }

  .clear {
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
