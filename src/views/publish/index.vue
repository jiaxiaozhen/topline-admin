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
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor v-model="publishForm.content"
          style="height=500px">
        </quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="publishForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <template v-if="publishForm.cover.type>0">
          <el-row>
            <el-col :span="6" v-for="n in publishForm.cover.type" :key="n">
              <upload-img v-model="publishForm.cover.images[n-1]"></upload-img>
            </el-col>
          </el-row>
        </template>
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
// 引入图片上传组件
import uploadImg from './components/upload-img'
// 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// 频道列表组件
import articleChannels from '@/components/article-channels'
export default {
  name: 'publish',
  components: {
    articleChannels,
    quillEditor,
    uploadImg
  },
  data () {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: ''
      }
    }
  },
  created () {
    if (this.$route.name === 'publish-edit') {
      this.loadArticle()
    }
  },
  methods: {
    async handlePublish (draft) {
      try {
        // 发表文章
        if (this.$route.name === 'publish') {
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
        } else {
          // 修改文章
          await this.$http({
            method: 'PUT',
            url: `/articles/${this.$route.params.id}`,
            params: {
              draft
            },
            data: this.publishForm
          })
          this.$message({
            type: 'success',
            message: '修改文章成功'
          })
          this.$router.push({ name: 'article' })
        }
      } catch (err) {
        this.$message.error('操作失败', err)
      }
    },
    async loadArticle () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: `/articles/${this.$route.params.id}`
        })
        this.publishForm = data
      } catch (err) {
        console.log(err)
        this.$message.error('获取该文章失败')
      }
    }
  }
}
</script>

<style>
.ql-editor, .ql-blank{
height: 300px ;
}
</style>
<style lang="less" scoped>

</style>
