<template>
  <el-card class="box-card">
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="380">
      </el-table-column>
      <el-table-column
        label="评论状态"
        width="180">
        <el-switch
          v-model="tableData.value"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
          label="操作">
          <template >
            <el-button size="mini" type="primary">修改</el-button>
          </template>
        </el-table-column>
    </el-table>
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
  name: 'commentList',
  data () {
    return {
      tableData: [],
      total_count: 0,
      per_page: 10,
      loading: false,
      page: 1
    }
  },
  created () {
    this.loadComments()
  },
  methods: {
    handleChangePage (page) {
      this.page = page
      this.loadComments()
    },
    async loadComments () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            page: this.page,
            per_page: this.per_page,
            response_type: 'comment'
          }
        })
        this.total_count = data.total_count
        this.page = data.page
        this.per_page = data.per_page
        data.results.value = false
        this.tableData = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载评论列表失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
