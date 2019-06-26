<template>
  <el-container class="main">
    <el-aside width="200px">
    <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header class="head">
        <AppHeader></AppHeader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from '@/views/layout/components/AppAside'
import AppHeader from '@/views/layout/components/AppHeader'

export default {
  name: 'layout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}
.head {
  padding: 0 0 0 30px;
  background: #fff;
  line-height: 60px;
}
.el-main{
  background: #eee;
}
</style>
