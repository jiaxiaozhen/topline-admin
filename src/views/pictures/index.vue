<template>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>图片管理</span>
  </div>
  <el-button-group>
  <el-button type="primary" plain size="small" @click="handleGet(false)">全部</el-button>
  <el-button type="primary" plain size="small" @click="handleGet(true)">收藏</el-button>
 </el-button-group>
 <el-upload
  class="upload-demo"
  action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
  :headers="{Authorization :`Bearer ${$store.state.user.token}`}"
  name="image"
  :on-success="uploadImg"
  :show-file-list="false"
  >
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
 <div class="img-list">
    <div
     class="item-images block"
     v-for="item in images"
     :key="item.id"
     >
      <el-image class="img" :src="item.url"></el-image>
      <div>
         <i :class="item.is_collected?'iconfont iconshoucang1':'iconfont iconcollection'"
            @click="handleCollect(item)"
            ></i>
         <!-- //iconcollection -->
         <i class="iconfont iconshanchu" @click="handleDelete(item)"></i>
      </div>
    </div>
 </div>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total_count"
    :page-size="per_page"
    @current-change="handleChangePage"
    :disabled="loading"
    :current-page="page">
    </el-pagination>
</el-card>

</template>

<script>
export default {
  name: 'pictures',
  data () {
    return {
      images: [],
      currentPage3: 1,
      total_count: 0,
      page: 0,
      per_page: 0,
      loading: false
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    async loadImages () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images'
        })
        this.total_count = data.total_count
        this.page = data.page
        this.per_page = data.per_page
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片失败')
      }
    },
    async handleCollect (item) {
      try {
        item.is_collected = !item.is_collected
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect: item.is_collected
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: item.is_collected ? '收藏成功' : '取消收藏成功'
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏图片失败')
      }
    },
    handleSizeChange () {},
    handleCurrentChange () {},
    handleChangePage (page) {
      this.page = page
      this.loadImages()
    },
    async handleGet (collect) {
      this.collect = collect
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect
          }
        })
        this.total_count = data.total_count
        this.page = data.page
        this.per_page = data.per_page
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载素材失败')
      }
    },
    async handleDelete (item) {
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除图片成功'
        })
        this.handleGet(item.is_collected)
      } catch (err) {
        console.log(err)
        this.$message.error('删除图片失败')
      }
    },
    uploadImg () {
      this.loadImages()
    }

  }
}
</script>

<style lang="less" scoped>
  .upload-demo {
      float: right;
  }
  .img-list{
      overflow: hidden;
      .item-images {
      float: left;
      margin: 20px 30px 20px 25px;
      .img {
          width: 150px;
      height: 140px;
      }
      .iconshanchu{
          float: right;
          margin-right: 30px;
      }
      .iconshoucang1,.iconcollection{
          margin-left: 30px;
          color:red;
      }
    }
  }

</style>
