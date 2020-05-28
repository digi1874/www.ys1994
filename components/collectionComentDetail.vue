<template>
  <y-card class="comment-detail">
    <UserBar :detail="{ id: detail.userId }" />
    <span class="date">{{ detail.createdTime | formatDate }}</span>
    <AtUser :value="detail.content" class="pre-wrap" :style="{ color: gradeColor(detail.grade) }" />
    <template v-slot:footer>
      <div v-if="detail.userLike" class="util-bar">
        <div class="item" :class="{ active: token && detail.userLike.state === 1 }" @click="like(1)">
          <no-ssr><icon type="like" /></no-ssr>
          <span>{{ detail.like }}</span>
        </div>
        <div class="item" :class="{ active: token && detail.userLike.state === 2 }" @click="like(2)">
          <no-ssr><icon type="dislike" /></no-ssr>
          <span>{{ detail.dislike }}</span>
        </div>
      </div>
    </template>
  </y-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import UserBar from './userBar'
import AtUser from './atUser'

export default {
  components: {
    UserBar,
    AtUser
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    })
  },
  methods: {
    ...mapMutations({
      setDetail: 'collectionComment/setDetail'
    }),
    gradeColor (val) {
      return this.$options.filters.gradeColor(val) || ''
    },
    like (state) {
      if (!this.token) {
        this.$goLogin()
        return
      }

      if (this.detail.userLike.state === state) {
        state = 3
      }
      this.$api.likeCollectionComment({ vodCollectionCommentId: this.detail.id, state })
    }
  }
}
</script>
