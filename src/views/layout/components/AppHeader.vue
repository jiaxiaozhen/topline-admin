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
            <img width="40px" :src="userInfo.photo">
            <span class="el-dropdown-link">
              {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {
      userInfo: JSON.parse(window.localStorage.getItem('user_info'))
    }
  },
  methods: {

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
