<template>
<div class="header-wrap">
    <el-row :gutter="20" >
      <el-col :span="14">
        <div class="grid-content bg-purple">
          江苏传智播客教育科技股份有限公司
        </div>
      </el-col>
      <el-col :span="4" :offset="6">
        <div class="grid-content bg-purple">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img width="40px" :src="userInfo.photo">
              {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
import { removeUser } from '@/utils/auth'
export default {
  name: 'AppAside',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
    console.log(this.userInfo)
  },
  methods: {
    handleLogout () {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // window.localStorage.removeItem('user_info')
        removeUser()
        // this.$router.push({ name: 'login' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
img{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  vertical-align: middle;
}
.header-wrap{
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
</style>
