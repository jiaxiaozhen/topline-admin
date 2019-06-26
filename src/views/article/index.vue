<template>
  <div>
    <el-card class="box-card">
       <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table
      class="article-list"
      :data="tableData"
      style="width: 100%">
        <el-table-column
          label="封面"
          width="180">
           <!-- 如果需要在 template 中访问遍历项数据，则需要给 template 配置 slot-scope="scope"
              slot-scope 属性名是固定的
              scope 值是自己随便起的名字
            结果就是：我们可以通过 scope.row 访问到当前遍历项对象，就好比我们遍历中的 item 一样 -->
          <template slot-scope="scope">
            <!-- 自行循环 -->
            <img
            v-for="item in scope.row.image"
            src="item"
            :key="item">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="380">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-tag :type="status[scope.row.status].type">{{ status[scope.row.status].text }}</el-tag>
          </template>
          <el-tag>草稿</el-tag>

          <el-tag type="info">待审核</el-tag>
          <el-tag type="warning">审核失败</el-tag>
          <el-tag type="danger">已删除</el-tag>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="per_page"
          @current-change="handleChangePage"
          :disabled="loading">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'article',
  data () {
    return {
      tableData: [],
      page: 1,
      per_page: 10,
      totalPage: 0,
      status: [
        { type: '', text: '草稿' },
        { type: 'info', text: '待审核' },
        { type: 'success', text: '审核通过' },
        { type: 'warning', text: '审核失败' },
        { type: 'danger', text: '已删除' }
      ],
      loading: false
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true
      const res = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.per_page
        }
      })
      this.tableData = res.results
      this.totalPage = res.total_count
      this.loading = false
    },
    handleChangePage (page) {
      this.page = page
      this.loadArticle()
    }
  }
}
</script>

<style lang="less" scoped>
.article-list{
  margin-bottom: 30px;
}
.box-card{
  margin-bottom: 20px;
}
</style>
