<template>
  <div>
    <div class="img1" @click="handleShowPic">
      <p>点击图标选择图片</p>
      <i v-if="!value" class="el-icon-picture-outline"></i>
      <img v-else :src="value" width="182px" height="195px">
    </div>
    <el-dialog
     :visible.sync="dialogVisible"
     width="50%">
      <el-tabs type="border-card" value="second">
        <el-tab-pane label="上传图片" name="first">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="{Authorization :`Bearer ${$store.state.user.token}`}"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="素材库" name="second">
          <el-button-group>
            <el-button type="primary" plain size="small" @click="handleGet(false)">全部</el-button>
            <el-button type="primary" plain size="small" @click="handleGet(true)">收藏</el-button>
          </el-button-group>
          <div class="img-list">
            <div
             class="item-images block"
             v-for="item in images"
             :key="item.id"
             @click="handleSelect(item)">
             <el-badge is-dot class="item" v-if="item.id===select.id">
                <el-image class="img" :src="item.url"></el-image>
             </el-badge>
             <el-image v-else class="img" :src="item.url"></el-image>
            </div>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total_count"
            :page-size="per_page"
            @current-change="handleChangePage"
            :current-page="page">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadImg',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      imageUrl: null,
      total_count: 0,
      page: 0,
      per_page: 6,
      images: [],
      select: {}
    }
  },
  created () {
    this.handleGet()
  },
  methods: {
    handleShowPic () {
      this.dialogVisible = true
    },
    handleAvatarSuccess (res) {
      this.imageUrl = res.data.url
    },
    handleUpload () {
      this.dialogVisible = false
      // 组件传值
      this.$emit('input', this.imageUrl)

      // 素材库选中的图片
    },
    async handleGet (collect = false) {
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
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载素材失败')
      }
    },
    handleChangePage (page) {
      this.page = page
      this.loadImages()
    },
    handleSelect (item) {
      this.select = item
      this.imageUrl = item.url
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="less" scoped>
.img1 {
  border: 1px solid #ccc;
  width: 260px;
  text-align: center;
  .el-icon-picture-outline {
    font-size: 80px;
    color: #ccc;
    margin:50px;
    margin-bottom: 80px
  }
}
.img-list{
      overflow: hidden;
      .item-images {
      float: left;
      margin: 10px;
      .img {
          width: 110px;
          height: 100px;
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
