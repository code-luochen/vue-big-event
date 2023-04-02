<template>
  <el-card class="box-card">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <span style="font-weight:bold;">基本资料</span>
    </div>
    <!-- 表单区域 -->
    <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="100px">
      <el-form-item label="登录名称" prop="username" >
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
             <el-button type="primary" @click="submitFn">提交修改</el-button>
            <el-button @click="resetFn" >重置</el-button>
     </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserInfoAPI } from '@/api'
export default {
    name: 'my-userInfo',
    data () {
        return {
            userForm: {
                username: this.$store.state.userInfo.username,
                nickname: '',
                email: ''
            },
            userFormRules: {
                nickname: [
                { required: true, message: '请输入用户昵称', trigger: 'blur' },
                { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
                ],
                 email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '输入的格式不对', trigger: 'blur' }
            ]
            }
        }
    },
    methods: {
        // 提交修改的点击事件
        submitFn () {
            this.$refs.userFormRef.validate(async valid => {
                if (valid) {
                    // 校验成功
                    // 获取更新的接口
                    // 由于后台接口必须要填写id，所以需要将用户的id传入
                    this.userForm.id = this.$store.state.userInfo.id
                   const { data: res } = await updateUserInfoAPI(this.userForm)
                   if (res.code === 0) {
                      this.$message.success('更改数据成功！！')
                      this.$store.dispatch('initUserInfo', this.userForm)
                       this.$refs.userFormRef.resetFields()
                   } else {
                    this.$message.error('更新数据失败！！')
                   }
                  //  console.log(res)
                  //   console.log(this.userForm)
                } else {
                    this.$message.error('请按要求填写内容！！ ')
                    return false
                }
            })
        },
        // 重置按钮的处理事件
        resetFn () {
          // 将输入框中的邮箱和昵称置空
          // 传统写法
          // this.userForm.nickname = ''
          // this.userForm.email = ''
          // el提供写法，可以自动清除校检结果
            this.$refs.userFormRef.resetFields()
        }
   }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.el-form{
    width: 500px;
}
</style>
