<template>
  <el-select :value="value"
  @change="handleChange">
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'articleChannels',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    this.loadingArticles()
  },
  methods: {
    async loadingArticles () {
      try {
        const res = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.channels = res.channels
      } catch (err) {
        this.$message.error('获取频道数据失败', err)
      }
    },
    handleChange (e) {
      this.$emit('input', e)
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
