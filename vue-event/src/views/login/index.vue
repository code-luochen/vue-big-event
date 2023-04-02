<template>
  <!--登录页面的盒子 -->
  <div class="login-container">
    <!--登录的盒子 -->
    <div class="login-box">
      <!-- login的标题 -->
      <div class="login-text"></div>
      <!-- 登录表单的主体区域 -->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
          type="password" ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'my-login',
  data () {
    return {
      loginForm: {
        usename: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    // 登录按钮的处理事件
    loginFn () {
      // 检验表单
      this.$refs.loginRef.validate(async valid => {
        if (valid) {
          // 表示检验成功
          // console.log('ok')
          const { data: res } = await loginAPI(this.loginForm)
          // 登录失败
          if (res.code !== 0) return this.$message.error(res.message)
          // 登录成功
          this.$message({
          message: '欢迎登录',
          type: 'success'
        })
        // 将token值保存到vuex中
        //  console.log('ok')
        this.updateToken(res.token)
        this.$router.push('/')
        } else {
          this.$message.error('请按要求填写！！')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    .login-text {
      height: 60px;
      background: url("@/assets/images/login_title.png") center no-repeat;
    }
  }
}
.el-form {
  padding: 0 30px;
}
.btn-login {
  width: 100%;
}
</style>
