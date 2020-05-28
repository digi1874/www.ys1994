<template>
  <div class="detail-page">
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>
    <template v-else>
      <div class="card hidden flex detail">
        <y-lazier :src="vodDetail.pic | httpsUrl" :alt="vodDetail.name" class="pic" />
        <div class="info">
          <h1 class="title">
            <span>
              {{ vodDetail.name }}
            </span>
            <span v-if="vodDetail.serial" class="tag">
              {{ vodDetail.serial }}
            </span>
            <no-ssr>
              <span v-if="playDetail.id" class="flex align-center">
                <span v-if="playDetail.id" class="tag">
                  已观看到{{ playDetail.m3u8.name }}{{ playDetail.timeText }}
                </span>
                <nuxt-link :to="{ name: 'play', query: { id: vodDetail.id, urlId: playDetail.m3u8.id, type: '1' } }" class="btn btn-green">
                  继续播放
                </nuxt-link>
              </span>
              <span class="btn btn-green" @click="like">{{ isLike ? '已' : '' }}收藏</span>
            </no-ssr>
          </h1>
          <p>
            别名：{{ vodDetail.subName }}
          </p>
          <p>
            导演：{{ vodDetail.director }}
          </p>
          <p>
            <span class="name">主演：</span>
            {{ vodDetail.actor }}
          </p>
          <div class="flex">
            <div class="item">
              <p>
                类型：{{ vodDetail.typePId | vodType }}/{{ vodDetail.typeId | vodType }}
              </p>
              <p>
                语言：{{ vodDetail.lang }}
              </p>
            </div>
            <div class="item">
              <p>
                地区：{{ vodDetail.area }}
              </p>
              <p>
                上映：{{ vodDetail.year || '' }}
              </p>
            </div>
            <div class="item">
              <p>
                收藏：{{ vodData.likeCount }}
              </p>
            </div>
          </div>
          <p>
            <span class="name">介绍：</span>
            {{ vodDetail.content }}
          </p>
        </div>
      </div>
      <no-ssr>
        <y-card title="评分">
          <div class="flex wrap score">
            <p>
              影片：<y-starBar :value="vodData.vodStar / 10 || 0" :show-value="true" />（{{ vodData.vodStarCount }}人评分）
            </p>
            <p>
              导演：<y-starBar :value="vodData.directorStar / 10 || 0" :show-value="true" />（{{ vodData.directorStarCount }}人评分）
            </p>
            <p>
              男主：<y-starBar :value="vodData.actorStar / 10 || 0" :show-value="true" />（{{ vodData.actorStarCount }}人评分）
            </p>
            <p>
              女主：<y-starBar :value="vodData.actressStar / 10 || 0" :show-value="true" />（{{ vodData.actressStarCount }}人评分）
            </p>
            <p>
              男配：<y-starBar :value="vodData.suppActorStar / 10 || 0" :show-value="true" />（{{ vodData.suppActorStarCount }}人评分）
            </p>
            <p>
              女配：<y-starBar :value="vodData.suppActressStar / 10 || 0" :show-value="true" />（{{ vodData.suppActressStarCount }}人评分）
            </p>
            <p>
              剧本：<y-starBar :value="vodData.screenplayStar / 10 || 0" :show-value="true" />（{{ vodData.screenplayStarCount }}人评分）
            </p>
            <p>
              摄影：<y-starBar :value="vodData.cinematographyStar / 10 || 0" :show-value="true" />（{{ vodData.cinematographyStarCount }}人评分）
            </p>
            <p>
              剪辑：<y-starBar :value="vodData.editStar / 10 || 0" :show-value="true" />（{{ vodData.editStarCount }}人评分）
            </p>
            <p>
              音效：<y-starBar :value="vodData.soundStar / 10 || 0" :show-value="true" />（{{ vodData.soundStarCount }}人评分）
            </p>
            <p>
              视觉：<y-starBar :value="vodData.visualStar / 10 || 0" :show-value="true" />（{{ vodData.visualStarCount }}人评分）
            </p>
            <p>
              化妆：<y-starBar :value="vodData.makeupStar / 10 || 0" :show-value="true" />（{{ vodData.makeupStarCount }}人评分）
            </p>
            <p>
              服装：<y-starBar :value="vodData.costumeStar / 10 || 0" :show-value="true" />（{{ vodData.costumeStarCount }}人评分）
            </p>
            <p>
              音乐：<y-starBar :value="vodData.musicStar / 10 || 0" :show-value="true" />（{{ vodData.musicStarCount }}人评分）
            </p>
          </div>
        </y-card>
        <UrlList title="播放 ①" :vod-id="vodDetail.id" :list="vodDetail.m3u8List" type="1" />
        <UrlList title="播放 ②" :vod-id="vodDetail.id" :list="vodDetail.urlList" type="2" />
        <UrlList title="下载" :vod-id="vodDetail.id" :list="vodDetail.downUrlList" />
        <y-card title="磁链">
          暂无数据
        </y-card>

        <div v-if="myComment.vodId">
          <CommentForm v-model="myComment" />
        </div>
      </no-ssr>
      <y-card title="评论">
        <CommentList :list="commentList.data" />
        <div v-if="commentList.count > 0" class="text-center">
          <nuxt-link :to="{ path: 'vodComment', query: { vodId: vodId, page: 1 } }">
            查看更多
          </nuxt-link>
        </div>
      </y-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import { asyncDataGetVodDetail, handleDBVodData, getVodDetail } from '@/db/vodDetail'
import { VOD } from '@/dict'
import UrlList from '@/components/urlList'
import CommentForm from '@/components/commentForm'
import CommentList from '@/components/commentList'

export default {
  components: {
    UrlList,
    CommentForm,
    CommentList
  },
  async asyncData ({ $api, query }) {
    const { errorMsg, vodDetail } = await asyncDataGetVodDetail({ $api, query })
    if (!errorMsg) {
      await $api.getCommentList({ page: 1, filter: { vodId: query.id * 1 }, orders: JSON.stringify([['reply', 'DESC']]) })
    }
    return { errorMsg, vodDetail }
  },
  data () {
    return {
      vodData: {},
      isLike: false,
      playDetail: {},
      myComment: {}
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token,
      commentList: store => store.comment.list
    }),
    vodId () {
      return this.$route.query.id * 1
    }
  },
  watch: {
    token () {
      this.getUserVodData()
      this.getCommentList()
    },
    vodId () {
      this.getDetail()
      this.getUserVodData()
      this.getCommentList()
    }
  },
  mounted () {
    if (!this.errorMsg) {
      this.handleDBVodData()
      this.$hasLogin().then(this.getUserVodData)
    }
  },
  methods: {
    getDetail () {
      getVodDetail(this).then((data) => {
        this.vodDetail = data
      }).catch(({ response, message }) => {
        this.errorMsg = response.data.msg || message
      }).finally(() => {
        this.handleDBVodData()
      })
    },
    getUserVodData () {
      if (this.getUserVodData.loading) {
        return
      }

      this.vodData = {}
      this.isLike = false
      this.playDetail = {}
      this.myComment = {
        vodId: this.vodId
      }

      if (!this.errorMsg) {
        this.getUserVodData.loading = true
        this.$api.getVodData(this.vodId).then(({ data }) => {
          this.vodData = data.vodData
          if (this.token) {
            this.isLike = data.like.state === 1

            data.play.timeText = `${Math.floor(data.play.time / 60)}分${data.play.time % 60}秒`
            this.playDetail = data.play

            this.myComment = { ...data.comment, vodId: this.vodId }
          }
        }).finally(() => {
          this.getUserVodData.loading = false
        })
      }
    },
    like () {
      if (!this.token) {
        this.$goLogin()
      } else if (!this.like.loading) {
        this.like.loading = true
        this.$api.likeVod(this.vodId).then(({ data }) => {
          this.isLike = data === 1
          this.vodData.likeCount += this.isLike ? 1 : -1
          this.$message.success(this.isLike ? '收藏成功' : '取消成功')
        }).finally(() => {
          this.like.loading = false
        })
      }
    },
    handleDBVodData () {
      handleDBVodData(this).then((data) => {
        if (!isEmpty(data)) {
          this.vodDetail = data
        }
      })
    },
    getCommentList () {
      this.$api.getCommentList({ page: 1, filter: { vodId: this.vodId }, orders: '[["reply","DESC"]]' })
    }
  },
  head () {
    const { vodDetail } = this
    if (isEmpty(this.vodDetail)) { return }

    const vodType = VOD.TYPE_TEXT[vodDetail.typeId]
    const vodPType = VOD.TYPE_TEXT[vodDetail.typePId]
    let description = `《${vodDetail.name}》是由${vodDetail.director}导演，${vodDetail.actor}等主演的${vodType}。在线观看《${vodDetail.name}》全集高清视频。剧情简介：${vodDetail.content}`
    if (description.length > 150) {
      description = description.substring(0, 146) + '...'
    }

    return {
      title: `${vodDetail.name}-${vodType}-${vodPType}-全集高清视频在线观看`,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${vodDetail.name},${vodDetail.name}高清视频,${vodDetail.name}全集`
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
.detail-page {
  padding: 10px;

  > .detail {
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

      > span {
        display: inline-block;
      }
    }

    .title {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 24px;
      line-height: 40px;

      .tag {
        margin-left: 10px;
        border-radius: 3px;
        padding: 2px 5px;
        height: 24px;
        line-height: 20px;
        font-size: 14px;
        background-color: #859b93;
        color: #fff;
      }

      .btn {
        margin-left: 10px;
        font-weight: normal;
      }
    }

    .item {
      display: flex;
      flex-wrap: wrap;

      p {
        width: 200px;
      }
    }
  }

  .score {
    p {
      display: flex;
      width: 300px;
    }
  }
}
</style>
