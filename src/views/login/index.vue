<template>
  <div class="login-wrap">
    <div class="login-page">
      <div>
        <img src="./logo_index.png" alt="">
      </div>
      <el-form ref="userForm" :model="userForm" class="userForm" :rules="rules">
        <el-Form-item prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="15" prop="code"><el-input v-model="userForm.code" placeholder="请输入验证码" ></el-input></el-col>
          <el-col :span="8"><el-button type="primary" plain @click="handleCheck">发送验证码</el-button></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20"><el-button type="primary" @click="handleLogin" class="loginBtn">登录</el-button></el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 引入极验
import '@/vendor/gt.js'
export default {
  data () {
    return {
      userForm: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { len: 11, message: '请输入11位有效手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCheck (e) {
      // 发送验证码
      const mobile = this.userForm.mobile
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: res.data.data.gt,
          challenge: res.data.data.challenge,
          offline: !res.data.data.success,
          new_captcha: res.data.data.new_captcha,
          product: 'bind'
        },
        function (captchaObj) {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            if (e.target.innerText === '发送验证码') {
              // 停止倒计时才能弹出动态验证
              // 验证码ready之后才能调用verify方法显示验证码
              captchaObj.verify()
            }
          }).onSuccess(function () {
            let totalTime = 60
            let timer = setInterval(function () {
              if (totalTime > 0) {
                totalTime--
                e.target.innerText = totalTime + '秒后重新发送'
              } else if (totalTime < 1) {
                clearInterval(timer)
                e.target.innerText = '发送验证码'
              }
            }, 1000)
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              console.log(res.data)
            })
          }).onError(function () {

          })
        })
      })
    },
    handleLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.userForm
      }).then(() => {
        this.$message({
          message: '恭喜你，登录成功',
          type: 'success'
        })
        this.$router.push({ name: 'home' })
      }).catch(() => {
        this.$message.error('登录失败，手机或验证码错误')
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          alert('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          alert('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-wrap {
  height: 100%;
  background: url(./login_bg.jpg) no-repeat;
  background-size:cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-page {
    background: #fff;
    padding: 40px;
    text-align: center;
    .userForm{
      margin-top: 20px;
      .loginBtn{
      width: 123%;
      margin-top: 20px
    }
    }
  }
}
</style>
