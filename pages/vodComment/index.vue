<template>
  <div>
    <CommentList :list="list.data" :vod-id="vodId" />
    <y-pagination v-if="list.count" :pages="list.pages" :active="list.page" :to="'/vodComment?vodId=' + vodId + '&page='" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommentList from '@/components/commentList'

export default {
  components: {
    CommentList
  },
  async asyncData ({ $api, query }) {
    const page = query.page * 1 || 1
    await $api.getCommentList({ page, filter: { vodId: query.vodId * 1 } })
    return {}
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      list: store => store.comment.list
    }),
    vodId () {
      return this.$route.query.vodId * 1
    },
    page () {
      return this.$route.query.page * 1 || 1
    }
  },
  watch: {
    token () {
      this.getCommentList()
    },
    page () {
      this.getCommentList()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  },
  beforeMount () {
    this.$hasLogin()
  },
  methods: {
    getCommentList () {
      this.$api.getCommentList({ page: this.page, filter: { vodId: this.vodId } })
    }
  }
}
</script>
