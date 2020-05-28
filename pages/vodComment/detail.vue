<template>
  <div class="vod-comment-detail-page">
    <p v-if="errorMsg" class="text-center">
      {{ errorMsg }}
    </p>

    <template v-else>
      <CommentDetail :detail="detail" />

      <y-card title="回复" class="relative">
        <y-loading v-show="subimtLoading" />
        <TextareaAtUser
          v-model="formData.content"
          rows="1"
          max="100"
          @atUserIds="ids => formData.atUserIds = ids"
        />
        <template v-slot:footer>
          <div v-if="detail.userLike" class="util-bar">
            <div class="item" @click="submitReply">
              提交
            </div>
          </div>
        </template>
      </y-card>

      <y-card title="回复列表">
        <y-loading v-show="!replyList.data" />
        <template v-if="replyList.data">
          <p v-if="replyList.page === 1 && !replyList.data.length">
            暂无数据
          </p>

          <template v-else>
            <CommentReply v-for="(item, index) in replyList.data" :key="index" :detail="item" />
            <y-pagination :pages="replyList.pages" :active="replyList.page" :to="`/vodComment/detail?vodId=${vodId}&id=${id}&page=`" />
          </template>
        </template>
      </y-card>
    </template>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import { mapState } from 'vuex'
import CommentDetail from '@/components/commentDetail'
import TextareaAtUser from '@/components/textareaAtUser'
import CommentReply from '@/components/commentReply'

export default {
  components: {
    CommentDetail,
    TextareaAtUser,
    CommentReply
  },
  async asyncData ({ $api, query }) {
    let errorMsg
    const id = query.id * 1
    try {
      await $api.getCommentDetail(id)
    } catch ({ response, message }) {
      errorMsg = response.data.msg || message
    }

    !errorMsg &&
    await $api.getCommentReplyList({ page: query.page * 1 || 1, filter: { userVodCommentId: id } })

    return { errorMsg }
  },
  data () {
    return {
      formData: {
        content: ''
      },
      subimtLoading: false
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      detail: store => store.comment.detail,
      replyList: store => store.commentReply.list
    }),
    vodId () {
      return this.$route.query.vodId * 1
    },
    id () {
      return this.$route.query.id * 1
    },
    page () {
      return this.$route.query.page * 1 || 1
    }
  },
  watch: {
    token () {
      this.$api.getCommentDetail(this.id)
      this.getCommentReplyList()
    },
    page () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.getCommentReplyList()
    }
  },
  methods: {
    gradeColor (val) {
      return this.$options.filters.gradeColor(val) || ''
    },
    submitReply () {
      if (!this.token) {
        this.$goLogin()
        return
      }

      if (!this.formData.content.length) {
        this.$message.info('请输入回复内容')
        return
      }

      if (this.formData.content.length > 100) {
        this.$message.info('回复内容过多')
        return
      }

      if (this.formData.atUserIds.length > 10) {
        this.$message.info('最多@10个人')
        return
      }

      this.subimtLoading = true

      this.$api.saveVodCommentReply({ vodCommentId: this.id, ...pick(this.formData, 'content', 'atUserIds') }).then(() => {
        this.$message.success('提交成功')
        this.formData.content = ''
      }).finally(() => {
        this.subimtLoading = false
      })
    },
    getCommentReplyList () {
      this.$api.getCommentReplyList({ page: this.page, filter: { userVodCommentId: this.id } })
    }
  }
}
</script>

<style lang="scss">
.vod-comment-detail-page {
  .date {
    display: block;
    margin: 10px 0;
    font-size: 12px;
    color: #666;
  }
}
</style>
