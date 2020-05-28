import forEach from 'lodash/forEach'
import Vue from 'vue'
import Icon from './icon'
import YCard from './card.vue'
import YDropdown from './dropdown.vue'
import YInput from './input.vue'
import YLazier from './lazier.vue'
import YLoading from './loading.vue'
import YMenu from './menu.vue'
import YMenuItem from './menuItem.vue'
import YPagination from './pagination.vue'
import YStarBar from './starBar.vue'
import message from './message'
import './index.scss'

const components = {
  YCard,
  YDropdown,
  YInput,
  YLazier,
  YLoading,
  YMenu,
  YMenuItem,
  YPagination,
  YStarBar
}

const design = {
  ...components,
  message,
  install () {
    forEach(components, (value, key) => {
      Vue.component(key, value)
    })

    Vue.component('icon', {
      props: {
        type: {
          type: String,
          default: ''
        }
      },
      render (h) {
        return h('i', { class: 'icon icon-' + this.type }, [ h(Icon[this.type]) ])
      }
    })
  }
}

export default design
