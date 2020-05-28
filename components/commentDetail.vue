<template>
  <y-card class="card comment-detail">
    <UserBar :detail="{ id: detail.userId }" />
    <span class="date">{{ detail.createdTime | formatDate }}</span>
    <div class="flex wrap stars">
      <p v-if="detail.vodStar">
        影片：<y-starBar :value="detail.vodStar" :edit="false" />
      </p>
      <p v-if="detail.directorStar">
        导演：<y-starBar :value="detail.directorStar" :edit="false" />
      </p>
      <p v-if="detail.actorStar">
        男主：<y-starBar :value="detail.actorStar" :edit="false" />
      </p>
      <p v-if="detail.actressStar">
        女主：<y-starBar :value="detail.actressStar" :edit="false" />
      </p>
      <p v-if="detail.suppActorStar">
        男配：<y-starBar :value="detail.suppActorStar" :edit="false" />
      </p>
      <p v-if="detail.suppActressStar">
        女配：<y-starBar :value="detail.suppActressStar" :edit="false" />
      </p>
      <p v-if="detail.screenplayStar">
        剧本：<y-starBar :value="detail.screenplayStar" :edit="false" />
      </p>
      <p v-if="detail.cinematographyStar">
        摄影：<y-starBar :value="detail.cinematographyStar" :edit="false" />
      </p>
      <p v-if="detail.editStar">
        剪辑：<y-starBar :value="detail.editStar" :edit="false" />
      </p>
      <p v-if="detail.soundStar">
        音效：<y-starBar :value="detail.soundStar" :edit="false" />
      </p>
      <p v-if="detail.visualStar">
        视觉：<y-starBar :value="detail.visualStar" :edit="false" />
      </p>
      <p v-if="detail.makeupStar">
        化妆：<y-starBar :value="detail.makeupStar" :edit="false" />
      </p>
      <p v-if="detail.costumeStar">
        服装：<y-starBar :value="detail.costumeStar" :edit="false" />
      </p>
      <p v-if="detail.musicStar">
        音乐：<y-starBar :value="detail.musicStar" :edit="false" />
      </p>
    </div>
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
        <div v-if="type==='list'" @click.capture="setDetail(detail)">
          <nuxt-link class="item" :to="{ path: 'vodComment/detail', query: { vodId: detail.vodId, id: detail.id, page: 1 } }">
            <no-ssr><icon type="message" /></no-ssr>
            <span>{{ detail.reply }}</span>
          </nuxt-link>
        </div>
        <div v-else class="item">
          <no-ssr><icon type="message" /></no-ssr>
          <span>{{ detail.reply }}</span>
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
      setDetail: 'comment/setDetail'
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
      this.$api.likeVodComment({ vodCommentId: this.detail.id, state })
    }
  }
}
</script>

<style lang="scss">
.comment-detail {
  .date {
    display: block;
    margin: 10px 0;
    font-size: 12px;
    color: #666;
  }

  .stars {
    margin-bottom: 10px;

    & > p {
      display: flex;
      width: 200px;
    }
  }
}
</style>
