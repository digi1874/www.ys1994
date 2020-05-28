<template>
  <y-card :title="title" class="url-list">
    <div v-if="list.length > 1" class="tabs">
      <span
        v-for="(item, i) in list"
        :key="item.id"
        class="link"
        :class="{ active: index === i }"
        @click="index = i"
      >
        {{ item.name }}
      </span>
    </div>
    <ul v-if="list.length" class="urls">
      <li v-for="item in list[index].urls" :key="item.id">
        <nuxt-link v-if="type" :to="{ name: 'play', query: { id: vodId, urlId: item.id, type: type } }" class="btn">
          {{ item.name }}
        </nuxt-link>
        <a v-else :href="item.url" class="btn">
          {{ item.name }}
        </a>
      </li>
    </ul>
    <p v-if="!list.length">
      暂无数据
    </p>
  </y-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    vodId: {
      type: Number,
      default: 0
    },
    type: {
      type: [Number, String],
      default: ''
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      index: 0
    }
  }
}
</script>
<style lang="scss">
.url-list {
  .tabs {
    padding-bottom: 10px;

    .link {
      margin: 10px;
    }
  }

  ul.urls {
    display: flex;
    flex-wrap: wrap;

    li {
      padding: 10px;
    }
  }
}
</style>
