<template>
  <div v-show="value" class="modal" @click="handleMask">
    <div class="modal-content" @click.stop>
      <div class="modal-close" @click="close">
        <icon type="close" />
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: this.value
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible () {
      this.overflow()
    }
  },
  mounted () {
    this.overflow()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    close () {
      this.visible = false
      this.overflow()
      this.$emit('input', false)
      this.$emit('cancel')
    },
    handleMask () {
      this.maskClosable && this.close()
    },
    overflow () {
      document.body.style.overflow = this.visible ? 'hidden' : ''
    }
  }
}
</script>

<style lang="scss">
@keyframes modalshow {
  0% {
    transform: translateY(-200px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 150px;
  background-color: rgba(0,0,0,.35);
}

.modal-content {
  position: relative;
  border-radius: 10px;
  padding: 10px;
  background-color: rgba(255,255,255,.9);
  animation: modalshow .4s;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #333;
  cursor: pointer;
}
</style>
