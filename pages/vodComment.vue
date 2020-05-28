<template>
  <div style="padding:10px">
    <p v-if="errorMsg" class="text-center">
      {{ errorMsg }}
    </p>
    <template v-else>
      <h3 style="margin-top: 10px; margin-left: 10px;">
        <nuxt-link :to="'/detail?id=' + vodDetail.id">
          {{ vodDetail.name }}
        </nuxt-link>
        - 评论
      </h3>
      <nuxt-child />
    </template>
  </div>
</template>

<script>
import { asyncDataGetVodDetail, handleDBVodData } from '@/db/vodDetail'

export default {
  asyncData: ctx => asyncDataGetVodDetail({ ...ctx, query: { id: ctx.query.vodId } }),
  mounted () {
    !this.errorMsg && handleDBVodData(this)
  }
}
</script>
