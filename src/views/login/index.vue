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
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="15"><el-input v-model="userForm.code" placeholder="请输入验证码" ></el-input></el-col>
            <el-col :span="8"><el-button type="primary" plain @click="handleSubmitCheck" :disabled="!!timer" :loading="loadingCode">{{ tip }}</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox v-model="userForm.checked" class="tips"></el-checkbox>
            <span class="agree-text">我已阅读并同意<a href="#" class="blue">用户协议</a>和<a href="#" class="blue">隐私条款</a></span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="20"><el-button :loading="loadingLogin" type="primary" @click="handleLogin" class="loginBtn">登录</el-button></el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入封装好的极验的promise
import initGeetest from '@/utils/init-geetest'
// 引入封装的本地存储用户信息模块
import { setUser } from '@/utils/auth'
// 引入极验js库
import '@/vendor/gt.js'
export default {
  data () {
    return {
      userForm: {
        mobile: '',
        code: '',
        checked: ''
      },
      totalTime: 60,
      tip: '获取验证码',
      timer: null,
      rules: {
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '请输入11位有效手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入6位有效数字', trigger: 'blur' }
        ],
        checked: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      loadingLogin: false,
      loadingCode: false
    }
  },
  methods: {
    handleSubmitCheck () {
      // 提交验证前，验证手机号格式
      this.$refs['userForm'].validateField('mobile', (errorMessage) => {
        if (errorMessage) {

        } else {
          this.handleCheck()
        }
      })
    },
    async handleCheck () {
      try {
        // 按钮加载中效果，禁止连续多次发送
        this.loadingCode = true
        // 发送验证码
        const mobile = this.userForm.mobile
        const res = await this.$http({
          method: 'GET',
          url: `/captchas/${mobile}`
        })
        const captchaObj = await initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: res.gt,
          challenge: res.challenge,
          offline: !res.success,
          new_captcha: res.new_captcha,
          product: 'bind'
        })
        this.requestCode(captchaObj, mobile)
      } catch (error) {
        this.$message.error('获取验证码失败')
        this.loadingCode = false
      }
    },
    requestCode (captchaObj, mobile) {
      try {
        // 这里可以调用验证实例 captchaObj 的实例方法
        captchaObj.onReady(() => {
        // 验证码ready之后才能调用verify方法显示验证码
          captchaObj.verify()
          // 加载中效果解开
          this.loadingCode = false
        }).onSuccess(async () => {
          const {
            geetest_challenge: challenge,
            geetest_seccode: seccode,
            geetest_validate: validate
          } = captchaObj.getValidate()
          await this.$http({
            method: 'GET',
            url: `/sms/codes/${mobile}`,
            params: {
              challenge,
              validate,
              seccode
            }
          })
          // 倒计时
          this.timeCount()
        })
      } catch (error) {
        this.$message.error('获取验证码失败')
        this.loadingCode = false
      }
    },
    handleLogin () {
      // 登陆前，验证整个表单
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.checkeLogin()
        } else {
          return false
        }
      })
    },
    async checkeLogin () {
      // 按钮加载效果
      this.loading = true
      try {
        // 登录请求
        const res = await this.$http({
          method: 'POST',
          url: '/authorizations',
          data: this.userForm
        })

        // 本地存储数据
        // window.localStorage.setItem('user_info', JSON.stringify(res.data.data))
        setUser(res)
        this.$message({
          message: '恭喜你，登录成功',
          type: 'success'
        })
        this.$router.push({ name: 'home' })
      } catch (error) {
        this.$message.error('登录失败，手机或验证码错误')
      }
      this.loading = false
    },
    timeCount () {
      this.timer = setInterval(() => {
        this.totalTime--
        this.tip = this.totalTime + '秒后重新发送'
        if (this.totalTime < 1) {
          clearInterval(this.timer)
          this.tip = '获取验证码'
          this.timer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
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
      .agree-text {
        margin-left: -20px;
        color:#999;
        .blue {
        color: #3296fa;
        text-decoration:none;
        }
      }
      .loginBtn{
      width: 123%;
    }
    }
  }
}
.tips{
  margin-left: -80px;
}

</style>
