<template>
  <div class="collection-detail-page">
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>
    <template v-else>
      <div class="card hidden detail">
        <y-lazier :src="detail.pic | imageUrl" :alt="detail.name" class="pic" />
        <div class="info">
          <h1 class="title">
            <span>
              {{ detail.name }}
            </span>
            <no-ssr>
              <span class="btn btn-green" @click="like">{{ isLike ? '已' : '' }}收藏</span>
            </no-ssr>
          </h1>
          <p>
            创建者：<no-ssr><UserLink v-if="detail.userId" :detail="{ id: detail.userId }" /></no-ssr>
          </p>
          <p>
            收藏: {{ detail.likeCount }}
          </p>
          <p class="content">
            <span class="name">绍介：</span>
            <span class="pre-wrap">
              <span>{{ detail.content }}</span>
            </span>
          </p>
        </div>
      </div>

      <y-card class="vod-list" title="影片">
        <ListCover :data-list="vodList.data" />
        <p v-if="vodList.data && !vodList.data.length">
          暂无数据
        </p>
        <y-pagination
          v-if="vodList.count"
          :pages="vodList.pages"
          :active="vodList.page"
          :to="`/collection/detail?id=${id}&cPage=${cPage}&page=`"
        />
      </y-card>

      <no-ssr>
        <y-card title="回复" class="relative">
          <y-loading v-show="subimtLoading" />
          <TextareaAtUser
            v-model="formData.content"
            rows="1"
            max="100"
            @atUserIds="ids => formData.atUserIds = ids"
          />
          <template v-slot:footer>
            <div class="util-bar">
              <div class="item" @click="submit">
                提交
              </div>
            </div>
          </template>
        </y-card>
      </no-ssr>
      <y-card title="评论">
        <CollectionComentList v-if="collectionCommentList.data" :list="collectionCommentList.data" />
        <y-pagination
          v-if="collectionCommentList.count"
          :pages="collectionCommentList.pages"
          :active="collectionCommentList.page"
          :to="`/collection/detail?id=${id}&page=${page}&cPage=`"
        />
      </y-card>
    </template>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import { mapState } from 'vuex'
import ListCover from '@/components/list/cover'
import UserLink from '@/components/userLink'
import TextareaAtUser from '@/components/textareaAtUser'
import CollectionComentList from '@/components/collectionComentList'

export default {
  components: {
    ListCover,
    UserLink,
    TextareaAtUser,
    CollectionComentList
  },
  async asyncData ({ query, $api, store, $axios }) {
    let errorMsg
    if (query.id) {
      const id = query.id * 1
      const page = query.page * 1 || 1
      try {
        await $api.getCollectionDetail(id)
      } catch ({ response, message }) {
        errorMsg = response.data.msg || message
      }
      if (!errorMsg) {
        await $api.getCollectionVodList(id, { size: 27, page })
        await $api.getCollectionCommentList({ page: query.cPage * 1 || 1, filter: { userVodCollectionId: id } })
      }
    }
    return { errorMsg }
  },
  data () {
    return {
      isLike: false,
      formData: {
        content: ''
      },
      subimtLoading: false
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      detail: store => store.collection.detail,
      vodList: store => store.collectionVod.list,
      collectionCommentList: store => store.collectionComment.list
    }),
    id () {
      return this.$route.query.id * 1
    },
    page () {
      return this.$route.query.page * 1 || 1
    },
    cPage () {
      return this.$route.query.cPage * 1 || 1
    }
  },
  watch: {
    token (val) {
      this.getIsLike()
      this.getCollectionCommentList()
    },
    page () {
      this.$api.getCollectionVodList(this.id, { size: this.vodList.size, page: this.page })
    },
    cPage () {
      this.getCollectionCommentList()
    }
  },
  mounted () {
    this.getIsLike()
  },
  methods: {
    like () {
      if (!this.token) {
        this.$goLogin()
      } else if (!this.like.loading) {
        this.like.loading = true
        this.$api.likeCollection(this.id).then(({ data }) => {
          this.isLike = data === 1
          this.$message.success(this.isLike ? '收藏成功' : '取消收藏成功')
        }).finally(() => {
          this.like.loading = false
        })
      }
    },
    getIsLike () {
      if (this.token) {
        this.$api.isLikeCollection(this.id).then(({ data }) => {
          this.isLike = data
        })
      } else {
        this.isLike = false
      }
    },
    submit () {
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

      this.$api.saveCollectionComment({ vodCollectionId: this.id, ...pick(this.formData, 'content', 'atUserIds') }).then(() => {
        this.$message.success('提交成功')
        this.formData.content = ''
      }).finally(() => {
        this.subimtLoading = false
      })
    },
    getCollectionCommentList () {
      this.$api.getCollectionCommentList({ page: this.cPage, filter: { userVodCollectionId: this.id } })
    }
  },
  head () {
    const { detail } = this
    if (!detail.id) {
      return {}
    }
    let description = detail.content.replace(/\n/g, ' ')
    if (description.length > 150) {
      description = description.substring(0, 146) + '...'
    }

    return {
      title: detail.name,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: detail.name
        },
        {
          hid: 'description',
          name: 'description',
          content: description
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.collection-detail-page {
  padding: 10px;

  .detail {
    display: flex;

    .pic {
      flex-shrink: 0;
      width: 240px;
      height: 320px;
    }

    .info {
      flex-grow: 1;
      padding: 10px 20px;
    }

    p {
      display: flex;
      margin-top: 10px;

      .name {
        flex-shrink: 0;
      }

      span {
        display: inline-block;
      }
    }

    .title {
      display: flex;
      align-items: center;
      font-size: 24px;

      .tag {
        margin-left: 10px;
        border-radius: 3px;
        padding: 2px 5px;
        line-height: 20px;
        font-size: 14px;
        background-color: #859b93;
        color: #fff;
      }

      .btn {
        margin-left: 10px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
}
</style>
