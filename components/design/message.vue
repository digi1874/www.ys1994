<template>
  <div v-show="list.length" class="messages">
    <p v-for="(item, index) in list" :key="index" class="message" :class="item.type || 'info'">
      {{ item.content }}
    </p>
  </div>
</template>

<script>
import forEach from 'lodash/forEach'
import remove from 'lodash/remove'

export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    forEach(['error', 'success', 'info'], (type) => {
      this.open[type] = content => this.open({ type, content })
    })
  },
  methods: {
    open (option) {
      const id = this.open.id + 1 || 1
      this.open.id = id

      this.list = [
        ...this.list,
        {
          ...option,
          id
        }
      ]

      setTimeout(() => {
        remove(this.list, item => item.id === id)
        this.list = [...this.list]
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.messages {
  position: fixed;
  z-index: 99999;
  top: 40px;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  height: 0;

  > .message {
    margin-bottom: 10px;
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
    box-shadow: 0 3px 6px rgba(0,0,0,.2);
  }

  .error {
    background-color: red;
  }

  .success {
    background-color: #859b93;
  }

  .info {
    background-color: #1890ff;
  }
}
</style>
