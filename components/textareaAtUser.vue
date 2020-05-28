<template>
  <span class="textarea-at-user-input">
    <textarea
      ref="textarea"
      v-model="textareaValue"
      :rows="rows"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @click="handleUserName"
    />
    <span v-if="max && textareaValue.length" class="value-length">
      <span :style="{ color: textareaValue.length > max ? 'red' : '' }">{{ textareaValue.length }}</span>
      /{{ max }}
    </span>
    <span ref="leftValue" class="left-value">{{ leftValue }}</span>
    <ul v-show="showSelectUser" ref="selectUser" class="select-user" :style="selectUserStyle">
      <li>选择@的人或直接输入</li>
      <li v-for="(item, index) in userList" :key="index" :class="{ active: selectUserIndex == index}" @click="handleSelectUserIndex(index)">
        {{ item.name }}
      </li>
    </ul>
  </span>
</template>

<script>
import forEach from 'lodash/forEach'
import { mapState } from 'vuex'
import { dbAddUser, dbGetUser, dbUpdateUser } from '@/db'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rows: {
      type: String,
      default: '10'
    },
    max: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      textareaValue: '',
      leftValue: '',
      userName: '',
      selectUserIndex: 0,
      showSelectUser: false,
      selectUserStyle: '',
      selectedUsers: {}
    }
  },
  computed: {
    ...mapState({
      userList: store => store.userSearch.list.data || []
    })
  },
  watch: {
    value () {
      this.initTextareaValue()
    },
    textareaValue (val) {
      let value = this.textareaValue
      const atUserIds = []

      forEach(this.selectedUsers, (item) => {
        const RE = new RegExp(`(@${item.name} )`, 'g')
        if (RE.test(value)) {
          atUserIds.push(item.id)
          value = value.replace(RE, `$1->${item.id} `)
        }
      })

      this.$emit('input', value)
      this.$emit('atUserIds', atUserIds)
    },
    userName (val) {
      this.showSelectUser = false
      this.selectUserIndex = 0
      val && this.$api.searchUser({ filter: { name: this.userName } }).finally(() => {
        this.showSelectUser = this.userList.length > 0
      })
    },
    userList (val) {
      forEach(val, (user) => {
        user = { ...user, avatar: user.avatar.image }
        dbGetUser(user.id).then((data) => {
          dbUpdateUser({
            ...data,
            ...user
          })
        }).catch(() => {
          dbAddUser(user)
        })
      })
    }
  },
  created () {
    this.initTextareaValue()
  },
  methods: {
    initTextareaValue () {
      const RE = /@(\S+) ->([0-9])+ /g
      let { value } = this
      let execValue = RE.exec(value)
      while (execValue) {
        const id = execValue[2] * 1
        const name = execValue[1]
        this.selectedUsers[id] = {
          ...this.selectedUsers[id],
          id,
          name
        }
        execValue = RE.exec(value)
      }
      value = value.replace(/(@\S+) ->[0-9]+ /g, '$1 ')
      this.textareaValue = value
    },
    handleKeydown (e) {
      if (this.showSelectUser) {
        if (e.keyCode === 27) {
          this.showSelectUser = false
        } else if ([13, 38, 40].includes(e.keyCode) && this.userList) {
          e.preventDefault()
          if (e.keyCode === 13) {
            this.handleSelectUser()
          } else if (e.keyCode === 38) {
            this.selectUserIndex && --this.selectUserIndex
          } else if (e.keyCode === 40) {
            this.selectUserIndex < this.userList.length - 1 && ++this.selectUserIndex
          }
        }
      }
    },
    handleKeyup ({ keyCode }) {
      clearTimeout(this.handleKeyup.timer)
      this.handleKeyup.timer = setTimeout(() => {
        keyCode !== 27 && this.handleUserName()
      }, 300)
    },
    handleUserName () {
      this.userName = ''
      const { textarea } = this.$refs
      const leftValue = textarea.value.substring(0, textarea.selectionEnd)
      let execValue = /.*@(\S+?)$/.exec(leftValue)
      if (!execValue) { return }

      let userName = execValue[1]
      if (userName && !/'/.test(userName)) {
        const rightValue = textarea.value.substring(textarea.selectionEnd, textarea.value.length)
        execValue = /^\S+/.exec(rightValue)
        if (execValue) {
          userName += execValue[0]
        }
        this.userName = userName

        // 计算select-user位置
        // 最后一行保留@前面部分，其他行只保留换行
        this.leftValue = leftValue.replace(/.*([\r\n])/g, '$1').replace(/(.*)@.+?$/, '$1')
        this.$nextTick(() => {
          const left = this.$refs.leftValue.offsetWidth
          const maxLeft = this.$el.offsetWidth - 200
          this.selectUserStyle = {
            top: this.$refs.leftValue.offsetHeight - textarea.scrollTop + 'px',
            left: (left > maxLeft ? maxLeft : left) + 'px'
          }
        })
      }
    },
    handleSelectUser () {
      const { textarea } = this.$refs
      const { scrollTop } = textarea
      const user = this.userList[this.selectUserIndex]
      this.selectedUsers[user.id] = user

      const leftValue = textarea.value.substring(0, textarea.selectionEnd).replace(/(.*@).+?$/, '$1')
      const rightValue = textarea.value.substring(leftValue.length, textarea.value.length).replace(/\S+/, ' ')
      this.textareaValue = leftValue + user.name + rightValue
      this.showSelectUser = false

      this.$nextTick(() => {
        this.userName = ''
        const selection = leftValue.length + user.name.length + 1
        textarea.focus()
        textarea.setSelectionRange(selection, selection)
        textarea.scrollTop = scrollTop
      })
    },
    handleSelectUserIndex (index) {
      this.selectUserIndex = index
      this.handleSelectUser()
    }
  }
}
</script>

<style lang="scss">
.textarea-at-user-input {
  position: relative;
  display: flex;

  textarea {
    padding: 10px 15px;
    min-height: 42px;
    line-height: 22px;
  }

  .value-length {
    position: absolute;
    right: 20px;
    bottom: 0;
    user-select: none;
    pointer-events: none;
  }

  .left-value {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    padding-top: 10px;
    padding-left: 15px;
    line-height: 22px;
    font-size: 14px;
    white-space: pre;
    opacity: 0;
    &:after {
      display: inline-block;
      vertical-align: bottom;
      min-height: 22px;
      content: '';
    }
  }

  .select-user {
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
    border-top: 4px solid rgba(0, 0, 0, 0.1);
    border-bottom: 4px solid rgba(0, 0, 0, 0.1);
    max-height: 250px;
    overflow-y: hidden;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);

    li {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 0 20px;
      white-space: nowrap;
      cursor: pointer;
    }

    .active {
      color: #fff;
      background-color: #859b93;
    }
  }
}
</style>
