import Vue from 'vue'
import Message from './message.vue'

export default (() => {
  if (!process.server) {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const vm = new Vue({
      el: div,
      render: h => h(Message)
    })
    return vm.$children[0].open
  }
})()
