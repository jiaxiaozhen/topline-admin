<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账号信息</span>
    </div>
    <el-row>
        <el-col :span="11">
            <el-form label-width="80px" >
        <el-form-item label="名称" >
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item label="头条号ID">
          <el-input :value="user.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input :value="user.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-button type="primary" style="margin-left:100px" @click="handleSaveUser">保存修改</el-button>
    </el-form>
        </el-col>
        <el-col :span="6" :offset="2">
            <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
            :http-request="handleChangeImg">
            <img v-if="user.photo" :src="user.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p>点击上传头像</p>
        </el-col>
    </el-row>
</el-card>
</template>

<script>
export default {
  name: 'userMeg',
  data () {
    return {
      user: {}
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    async loadUser () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        data.id = data.id.toString()
        this.user = data
      } catch (err) {
        console.log(err)
        this.$message.error('加载用户信息失败')
      }
    },
    async handleChangeImg (uploadConfig) {
      try {
        const formData = new FormData()
        formData.append('photo', uploadConfig.file)
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })
        this.user.photo = data.photo
        // 提交头像信息到store中
        this.$store.commit('changeUser', this.user)
      } catch (err) {
        console.log(err)
        this.$message.error('修改头像失败')
      }
    },
    async handleSaveUser () {
      try {
        const { name, intro, email } = this.user
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })
        this.$message({
          type: 'success',
          message: '保存修改成功'
        })
        // 提交 mutation，也就是调用 mutation 函数，第二个参数是传到store中的数据
        this.$store.commit('changeUser', data)
      } catch (err) {
        console.log(err)
        this.$message.error('保存修改失败')
      }
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
</style>
