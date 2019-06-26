<template>
<div class="aside-wrap">
  <el-col :span="24" >
    <h5 class="black"><img src="@/assets/logo_admin.png" height="100%"></h5>
    <el-menu
      default-active="/"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="rgb(53, 59, 78)"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true">
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="/article">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
       <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>粉丝管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">图文数据</el-menu-item>
          <el-menu-item index="3-2">粉丝概况</el-menu-item>
          <el-menu-item index="3-3">粉丝画像</el-menu-item>
          <el-menu-item index="3-4">粉丝列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
       <el-menu-item index="4">
        <i class="el-icon-menu"></i>
        <span slot="title">账户信息</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</div>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.aside-wrap{
  height: 100%;
  background: #303133;
}
h5{
  padding: 10px 0;
}
</style>
