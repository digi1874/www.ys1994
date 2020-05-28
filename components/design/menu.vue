<template>
  <ul class="menu">
    <slot />
  </ul>
</template>
vertical vertical-right horizontal inline
<style lang="scss">
.menu {
  > .menu-item {
    padding: 5px 10px;

    & + .menu-item {
      border-top: 1px solid rgba(0,0,0,.05);
    }
  }
}
</style>
