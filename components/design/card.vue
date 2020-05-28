<template>
  <div class="card">
    <h3 v-if="title" class="title">
      {{ title }}
    </h3>
    <div class="card-content">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.card {
  margin: 10px 10px 20px;
  border-radius: 10px;
  background-color: rgba(255,255,255,.3);
  box-shadow: 0 0 10px rgba(0,0,0,.2);

  > .title {
    display: inline-block;
    padding: 0 20px;
    border-radius: 10px 0 10px 0;
    background-color: #4a444b;
    line-height: 36px;
    color: #fff;
    box-shadow: 2px 2px 5px rgba(0,0,0,.2);
  }
}

.card-content {
  padding: 20px;
}
</style>
