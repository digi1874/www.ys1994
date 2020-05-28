<script>
import UserLink from './userLink'

const RE = /([^]*?)@(\S+) ->([0-9]+)( [^]*)/
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  render (createElement) {
    let VNodes = []
    let { value } = this
    let execValue = RE.exec(value)
    while (execValue) {
      VNodes = [
        ...VNodes,
        execValue[1],
        '@',
        createElement(UserLink, { props: { detail: { id: execValue[3] * 1, name: execValue[2] } } }),
        ' '
      ]
      value = execValue[4]
      execValue = RE.exec(value)
    }
    VNodes.push(value)
    return createElement(
      'div',
      {},
      VNodes
    )
  }
}
</script>
