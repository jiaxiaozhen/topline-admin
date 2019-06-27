<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <el-form ref="publishForm" :model="publishForm" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="publishForm.title" placeholder="文章名称"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="publishForm.content"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group>
          <el-radio label="单图"></el-radio>
          <el-radio label="三图"></el-radio>
          <el-radio label="无图"></el-radio>
          <el-radio label="自动"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <article-channels v-model="publishForm.channel_id"></article-channels>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="handlePublish(false)">发表</el-button>
        <el-button @click="handlePublish(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import articleChannels from '@/components/article-channels'
export default {
  name: 'publish',
  components: {
    articleChannels
  },
  data () {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: 3
      }
    }
  },
  methods: {
    async handlePublish (draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.publishForm
        })
        this.$message({
          type: 'success',
          message: '文章发布成功'
        })
        this.$router.push({ name: 'article' })
      } catch (err) {
        this.$message.error('文章发布失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
