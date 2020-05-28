<template>
  <y-card title="我的评论" class="my-comment">
    <p class="tips">
      打分成功后，大于1分的评分是无法修改为0分
    </p>
    <div @click.capture="hasLogin">
      <form class="comment-form" @submit.prevent>
        <div v-show="formData.vodStar || isEdit" class="item">
          <span class="label">影片：</span>
          <y-starBar v-model="formData.vodStar" :edit="isEdit" />
        </div>
        <div v-show="formData.directorStar || isEdit" class="item">
          <span class="label">导演：</span>
          <y-starBar v-model="formData.directorStar" :edit="isEdit" />
        </div>
        <div v-show="formData.actorStar || isEdit" class="item">
          <span class="label">男主：</span>
          <y-starBar v-model="formData.actorStar" :edit="isEdit" />
        </div>
        <div v-show="formData.actressStar || isEdit" class="item">
          <span class="label">女主：</span>
          <y-starBar v-model="formData.actressStar" :edit="isEdit" />
        </div>
        <div v-show="formData.suppActorStar || isEdit" class="item">
          <span class="label">男配：</span>
          <y-starBar v-model="formData.suppActorStar" :edit="isEdit" />
        </div>
        <div v-show="formData.suppActressStar || isEdit" class="item">
          <span class="label">女配：</span>
          <y-starBar v-model="formData.suppActressStar" :edit="isEdit" />
        </div>
        <div v-show="formData.screenplayStar || isEdit" class="item">
          <span class="label">剧本：</span>
          <y-starBar v-model="formData.screenplayStar" :edit="isEdit" />
        </div>
        <div v-show="formData.cinematographyStar || isEdit" class="item">
          <span class="label">摄影：</span>
          <y-starBar v-model="formData.cinematographyStar" :edit="isEdit" />
        </div>
        <div v-show="formData.editStar || isEdit" class="item">
          <span class="label">剪辑：</span>
          <y-starBar v-model="formData.editStar" :edit="isEdit" />
        </div>
        <div v-show="formData.soundStar || isEdit" class="item">
          <span class="label">音效：</span>
          <y-starBar v-model="formData.soundStar" :edit="isEdit" />
        </div>
        <div v-show="formData.visualStar || isEdit" class="item">
          <span class="label">视觉：</span>
          <y-starBar v-model="formData.visualStar" :edit="isEdit" />
        </div>
        <div v-show="formData.makeupStar || isEdit" class="item">
          <span class="label">化妆：</span>
          <y-starBar v-model="formData.makeupStar" :edit="isEdit" />
        </div>
        <div v-show="formData.costumeStar || isEdit" class="item">
          <span class="label">服装：</span>
          <y-starBar v-model="formData.costumeStar" :edit="isEdit" />
        </div>
        <div v-show="formData.musicStar || isEdit" class="item">
          <span class="label">音乐：</span>
          <y-starBar v-model="formData.musicStar" :edit="isEdit" />
        </div>
        <div style="width:100%;">
          <TextareaAtUser
            v-if="isEdit"
            v-model="formData.content"
            max="1000"
            placeholder="评论内容"
            style="width:100%;"
            @atUserIds="ids => formData.atUserIds = ids"
          />
          <AtUser v-else v-model="formData.content" class="pre-wrap" :style="{ color: gradeColor }" />
        </div>
        <div v-show="submitLoading" class="comment-form-loading">
          <y-loading />
        </div>
      </form>
      <div v-if="isEdit" class="util-bar">
        <div class="item" @click="submit">
          提交
        </div>
        <div class="item" @click="reset">
          取消
        </div>
      </div>
      <div v-if="id && !isEdit" class="util-bar">
        <div class="item" @click="isEdit=true">
          修改
        </div>
        <div class="item">
          <icon type="like" />
          <span>{{ value.like }}</span>
        </div>
        <div class="item">
          <icon type="dislike" />
          <span>{{ value.dislike }}</span>
        </div>
        <div @click="setDetail(value)">
          <nuxt-link class="item" :to="{ path: 'vodComment/detail', query: { id, vodId: formData.vodId, page: 1 } }">
            <icon type="message" />
            <span>{{ value.reply }}</span>
          </nuxt-link>
        </div>
      </div>
    </div>
  </y-card>
</template>

<script>
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import isEqual from 'lodash/isEqual'
import { mapState, mapMutations } from 'vuex'
import TextareaAtUser from './textareaAtUser'
import AtUser from './atUser'

const pickValue = value => pick(value, [
  'vodId',
  'grade',
  'content',
  'vodStar',
  'directorStar',
  'actorStar',
  'actressStar',
  'suppActorStar',
  'suppActressStar',
  'screenplayStar',
  'cinematographyStar',
  'editStar',
  'soundStar',
  'visualStar',
  'makeupStar',
  'costumeStar',
  'musicStar'
])

export default {
  components: {
    TextareaAtUser,
    AtUser
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const formData = pickValue(this.value)
    const id = this.value.id
    return {
      id,
      isEdit: !id,
      formData,
      oldFormData: { ...formData },
      submitLoading: false
    }
  },
  computed: {
    ...mapState({
      token: store => store.user.token
    }),
    gradeColor () {
      return this.$options.filters.gradeColor(this.formData.grade) || ''
    }
  },
  watch: {
    value (val) {
      const formData = pickValue(this.value)
      this.formData = formData
      this.oldFormData = { ...formData }
      this.id = val.id
      this.isEdit = !val.id
    }
  },
  beforeCreate () {
    this.$hasLogin()
  },
  methods: {
    ...mapMutations({
      setDetail: 'comment/setDetail'
    }),
    submit () {
      if (isEqual(this.formData, this.oldFormData)) {
        this.$message.info('没有修改')
        return
      }

      if (this.formData.content.length > 1000) {
        this.$message.info('内容过多')
        return
      }

      if (this.formData.atUserIds.length > 10) {
        this.$message.info('最多@10个人')
        return
      }

      let data = pick(this.formData, [
        'vodId',
        'content',
        'vodStar',
        'directorStar',
        'actorStar',
        'actressStar',
        'suppActorStar',
        'suppActressStar',
        'screenplayStar',
        'cinematographyStar',
        'editStar',
        'soundStar',
        'visualStar',
        'makeupStar',
        'costumeStar',
        'musicStar',
        'atUserIds'
      ])
      data = pickBy(data, value => value)
      this.submitLoading = true
      this.$api.saveVodComment(data).then((res) => {
        this.id = res.data
        this.oldFormData = {
          ...this.oldFormData,
          ...data
        }
        this.isEdit = false
        this.$message.success('提交成功')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    reset () {
      if (this.id) {
        this.isEdit = false
      }
      this.formData = { ...this.oldFormData }
    },
    hasLogin (e) {
      if (!this.token) {
        e.stopPropagation()
        this.$goLogin()
      }
    }
  }
}
</script>

<style lang="scss">
.comment-form {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 20px;

  .item {
    display: flex;
    margin-bottom: 10px;
    width: 200px;
    min-height: 34px;
    line-height: 34px;
  }

  .label {
    flex-shrink: 0;
    min-width: 50px;
    white-space: nowrap;
  }

  .btns {
    flex-grow: 1;
    display: flex;
    margin-top: 10px;

    .btn {
      margin-right: 10px;
    }
  }

}
.comment-form-loading {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.my-comment {
  .tips {
    padding: 0 20px;
    font-size: 12px;
    color: red;
  }

  .card-content {
    padding: 10px 0 0;
  }
}
</style>
