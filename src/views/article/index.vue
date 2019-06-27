<template>
  <div>
    <el-card class="box-card">
       <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="filertForm" :model="filterForm" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterForm.status">
            <el-radio @change="checkList">全部</el-radio>
            <el-radio
            v-for="(item, index) in status"
            :key="item.text"
            :label="index"
            @change="checkList"
            >{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择频道">
          <article-channels v-model="filterForm.channel_id" @change="checkList"></article-channels>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="value"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getDate">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ total_count }}条符合条件的内容</span>
      </div>
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
            width="50px"
            v-for="item in scope.row.cover.images"
            :src="item"
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
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="per_page"
          @current-change="handleChangePage"
          :disabled="loading"
          :current-page="page">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
import articleChannels from '@/components/article-channels'
export default {
  name: 'articleList',
  components: {
    articleChannels
  },
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
      loading: false,
      total_count: 0,
      filterForm: {
        status: undefined,
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      value: ''
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      // 去除无用字段，确保请求有效
      const data = {}
      for (let key in this.filterForm) {
        if (this.filterForm[key] !== null && this.filterForm[key] !== undefined && this.filterForm[key] !== '') {
          data[key] = this.filterForm[key]
        }
      }
      this.loading = true
      const res = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.per_page,
          ...data
        }
      })
      this.tableData = res.results
      this.totalPage = res.total_count
      this.total_count = res.total_count
      this.loading = false
    },
    handleChangePage (page) {
      this.page = page
      this.loadArticle()
    },
    getDate (value) {
      this.filterForm.begin_pubdate = value[0]
      this.filterForm.end_pubdate = value[1]
      this.page = 1
      this.loadArticle()
    },
    checkList () {
      this.page = 1
      this.loadArticle()
    },
    async handleDelete (item) {
      try {
        await this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http({
          method: 'DELETE',
          url: `articles/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.loadArticle()
      } catch (err) {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message.error('删除文章失败')
        }
      }
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
