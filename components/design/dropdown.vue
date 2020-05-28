<template>
  <div class="dropdown" @mouseenter="handelMouseenter">
    <slot />
    <div class="dropdown-content">
      <div class="triangle" :style="{ right: triangleRight }" />
      <div class="overlay">
        <slot name="overlay" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      triangleRight: 0
    }
  },
  methods: {
    handelMouseenter () {
      this.triangleRight = this.$el.clientWidth / 2 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  &:hover {
    .dropdown-content {
      display: block;
    }
  }
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: -6px;
  display: none;
  padding-top: 10px;

  .triangle {
    content: ' ';
    position: absolute;
    top: 4px;
    display: block;
    border: 6px solid transparent;
    border-top-color: rgba(255,255,255,.95);
    border-right-color: rgba(255,255,255,.95);
    box-shadow: 2px -2px 3px rgba(0,0,0,.1);
    transform: rotate(-45deg);
  }

  .overlay {
    border-top: 5px solid rgba(0,0,0,.1);
    border-bottom: 5px solid rgba(0,0,0,.1);
    border-radius: 10px;
    min-width: 200px;
    min-height: 20px;
    background-color: rgba(255,255,255,.95);
    box-shadow: 0 3px 6px rgba(0,0,0,.2);

  }
}
</style>
