<template>
  <div>
    <el-card class="box-card">
      <!-- 标题区域 -->
      <div slot="header" class="clearfix">
        <span>重置密码</span>
      </div>
      <!-- 主体区域，表单 -->
      <el-form
        :model="pwdForm"
        :rules="pwdFormRules"
        ref="pwdFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="old_pwd">
          <el-input type="password" v-model="pwdForm.old_pwd"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item  label="新密码" prop="new_pwd">
          <el-input type="password" v-model="pwdForm.new_pwd"></el-input>
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item  label="确认密码" prop="re_pwd">
          <el-input type="password" v-model="pwdForm.re_pwd"></el-input>
        </el-form-item>
        <!-- 修改密码，重置 -->
        <el-form-item>
          <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
          <el-button @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updatePwdAPI } from '@/api'
export default {
  name: 'UserPwd',
  data () {
    // 新旧密码不能相同
    const samePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.pwdForm.old_pwd === value) {
            callback(new Error('与原密码相同，请重新输入'))
          }
          callback()
        }
      }
    //   确认密码要和新密码相同
    const rePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.pwdForm.new_pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

    return {
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15位的非空字符串',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
             pattern: /^\S{6,15}$/,
             message: '密码必须是6-15位的非空字符串',
            trigger: 'blur'
          },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          {
              pattern: /^\S{6,15}$/,
             message: '密码必须是6-15位的非空字符串',
            trigger: 'blur'
          },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 修改密码的点击事件
    updatePwdFn () {
        // 校检表单
        this.$refs.pwdFormRef.validate(async valid => {
            if (valid) {
                // 调用接口修改密码
              const { data: res } = await updatePwdAPI(this.pwdForm)
              console.log(res)
              if (res.code === 0) {
                    this.$message.success('更新密码成功,请重新登录！')
                    this.$refs.pwdFormRef.resetFields()
                    // 重置密码成功后（被动退出）
                    this.$store.commit('updateToken', '')
                    this.$store.commit('updateUserInfo', {})
                    this.$router.push('/login')
              }
              this.$message.error('原密码错误！！')
            }
            return false
        })
    },
    // 修改密码的重置点击事件
    resetFn () {
       this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
}
.el-form{
    width: 500px;
}
</style>
