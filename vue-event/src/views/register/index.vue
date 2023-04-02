<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 注册的标题 -->
      <div class="reg-text"></div>
      <!-- 注册表单区域 -->
      <el-form ref="form" :model="form" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"
          type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="form.repassword"
            placeholder="请在次确认密码"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="registerFn" class="btn-reg"
            >注册</el-button
          >
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 经验：
// 前端绑定数据对象属性名，可以直接给要调用的功能接口的参数名一致
// 好处：我可以直接把前端的对象（带着同名的属性和前端的值）发给后台
import { registerAPI } from '@/api'
export default {
  name: 'my-register',
  data () {
    // 注意：必须在data中声明该箭头函数，才能确保this.form的使用
    const samePwFn = (rule, value, callback) => {
      if (value !== this.form.password) {
        // 如果验证失败，会返回一个错误的对象
        callback(new Error('两次输入密码不一致，请重新输入'))
      } else {
        // 验证成功后的回调函数
        callback()
      }
    }
    return {
      form: {
        // 表单的数据对象
        username: '', // 用户名
        password: '', // 密码
        repassword: '' // 确认密码
      },
      rulesObj: {
        // 表单的规则对象
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
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          },
          { validator: samePwFn, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 注册按钮的处理函数
    registerFn () {
      // 对整个表单的校检做一个兜底的校检
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 证明通过了校检,拿到绑定数据
          console.log(this.form)
          // 调用接口注册数据
          const { data: res } = await registerAPI(this.form)
          // 如果注册失败，返回信息
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message({
            message: res.message,
            type: 'success'
          })
          setInterval(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          return false // 阻止默认的提交行为（表单下面的红色提示会自动出现）
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    .reg-text {
      height: 60px;
      background: url("@/assets/images/login_title.png") center no-repeat;
    }
  }
}
.el-form {
  padding: 0 30px;
}
.btn-reg {
  width: 100%;
}
</style>
