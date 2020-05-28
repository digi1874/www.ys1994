<template>
  <ul class="list-cover">
    <li v-for="(item, index) in list" :key="index" :style="itemClass" @click.capture="$emit('itemClickCapture', item)">
      <nuxt-link :to="detailPath + item.id + (item.m3u8 ? '&urlId=' + item.m3u8.id : '')" :title="item.name" class="link">
        <y-lazier :src="item.pic | imageUrl | httpsUrl" :alt="item.name" class="pic" />
        <span v-if="item.serial" class="badge">{{ item.serial }}</span>
        <div :style="textsClass" class="texts">
          <p class="name">
            {{ item.name }}
          </p>
          <p v-if="item.content" class="content">
            {{ item.content }}
          </p>
          <template v-if="!item.content">
            <p v-if="item.m3u8" :style="{ fontSize: '15px' }">
              {{ item.m3u8.name }} {{ item.playTime | time }}
            </p>
            <p>
              {{ item.year }}/{{ item.area }}/{{ item.typeId | vodType }}
            </p>
            <p>
              {{ item.director }}
            </p>
            <p>
              {{ item.actor }}
            </p>
          </template>
        </div>
      </nuxt-link>
    </li>
    <li v-if="moreTo" :style="itemClass">
      <nuxt-link :to="moreTo" class="link more">
        查看<br>更多
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    // 列表数据
    dataList: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    // 是否换行，默认是
    wrap: {
      type: Boolean,
      default: true
    },
    detailPath: {
      type: String,
      default: '/detail?id='
    },
    // 查看更多的地址
    moreTo: {
      type: [ String, Object, Boolean, Array ],
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: this.dataList,
      // 列表项的样式
      itemClass: {},
      // 隐藏/显示的文字样式
      textsClass: {}
    }
  },
  watch: {
    dataList (val) {
      this.list = val
    }
  },
  mounted () {
    this.handleWidth()
  },
  methods: {
    handleWidth () {
      const { clientWidth } = this.$el
      const num = Math.round(clientWidth / 196.8)
      const itemWidth = clientWidth / num
      const itemHeight = itemWidth * 4 / 3

      if (!this.wrap && num <= this.list.length) {
        this.list = this.moreTo ? this.list.slice(0, num - 1) : this.list.slice(0, num)
      }

      this.itemClass = {
        width: itemWidth + 'px',
        height: itemHeight + 'px'
      }

      this.textsClass = {
        transform: `translateY(${itemHeight - 75}px)`
      }
    }
  }
}
</script>

<style lang="scss">
ul.list-cover {
  display: flex;
  flex-wrap: wrap;

  li {
    width: 196.8px;
    height: 262.4px;
    padding: 14px 12px;
  }

  .link {
    position: relative;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    background-color: #fff;
    color: #fff;

    &:hover {
      .texts {
        padding-top: 35px;
        transform: translateY(0px) !important;

        p {
          margin: 10px 0;
        }
      }
    }

    .pic {
      width: 100%;
      height: 100%;
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 0 0 0 8px;
      padding: 5px 10px;
      background-color: #859b93;
    }

    .texts {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 8px;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.6);
      transform: translateY(188px);
      transition: all 0.3s;

      .name {
        font-size: 16px;
        line-height: 24px;
        font-weight: bold;
      }

      p {
        overflow: hidden;
        white-space: nowrap;
      }

      .content {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        height: 110px;
        line-height: 22px;
        text-overflow: ellipsis;
        white-space: normal;
      }
    }
  }

  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 24px;
  }
}
</style>
