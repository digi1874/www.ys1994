<template>
  <div>
    <Header />

    <no-ssr>
      <Tips />
    </no-ssr>

    <nuxt />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Header from '@/components/header'
import Tips from '@/components/tips'

export default {
  components: {
    Header,
    Tips
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    })
  },
  watch: {
    token () {
      this.removeAllPlayList()
      this.removeAllCommentList()
      this.removeAllCommentDetail()
      this.removeAllCommentReplyList()
      this.removeAllCollectionCommentList()
    }
  },
  methods: {
    ...mapMutations({
      removeAllPlayList: 'playVod/removeAllList',
      removeAllCommentList: 'comment/removeAllList',
      removeAllCommentDetail: 'comment/removeAllDetail',
      removeAllCommentReplyList: 'commentReply/removeAllList',
      removeAllCollectionCommentList: 'collectionComment/removeAllList'
    })
  }
}
</script>
