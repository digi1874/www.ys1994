<template>
  <header>
    <div class="header-content">
      <div class="flex">
        <nuxt-link to="/" class="header-item logo" title="首页" style="font-size: 24px;">
          影视1994
        </nuxt-link>
        <SearchBar class="header-item" :class="{ active: $route.path == '/search' }" />
      </div>
      <no-ssr>
        <div class="flex">
          <DropdownVodLikeList />
          <UserMenu />
        </div>
      </no-ssr>
    </div>
  </header>
</template>

<script>
import SearchBar from './searchBar'
import DropdownVodLikeList from './dropdownVodLikeList'
import UserMenu from './userMenu'

export default {
  components: {
    SearchBar,
    DropdownVodLikeList,
    UserMenu
  }
}
</script>

<style lang="scss">
header {
  position: relative;
  z-index: 99999;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    background: #4a444b;
  }

  .header-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    cursor: pointer;

    &:hover,
    &.active {
      color: #333;
      background-color: #cfcfc7;
    }
  }
}
</style>
