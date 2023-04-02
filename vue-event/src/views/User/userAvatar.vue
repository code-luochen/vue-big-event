<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img
        v-if="avatar===''"
        class="the_img"
        src="../../assets/images/avatar.jpg"
        alt=""
      />
      <img v-else class="the_img" :src="avatar" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn" >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''// 用来存储图片的base64位的字符串
    }
  },

  methods: {
    // 选择图片的点击事件
    chooseImg () {
      // 目的：为了让input[type=file]标签，让他再用js代码来触发他的点击事件（导致他的默认行为给一个文件选择的窗口）
      // 原因：input[type=file]他是原生标签啊，样式不好改
      // 解决：移花接木
      // 用.click()可以触发dom元素默认的点击事件
      this.$refs.iptRef.click()
    },
    // 选择图片确定了
    // 在选择框中选择图片后触发的改变事件
    onFileChange (e) {
      // e是原生事件对象
      // 获取用户选择的文加列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 证明刚刚文件窗口打开了，但是它一个文件都没有选择然后点击了确定关闭选择弹窗
        this.avatar = ''
      } else {
        // 证明他选择了文件（默认只能选一个，如果选择多个你需要给input标签添加额外的原生属性）
        console.log(files[0])
        // 目标：选择的图片文件，要给到img标签上给前端页面做预览
        // img标签的src值
        // *只能是图片的“链接地址”(外链http://开头，图片文件相对路径)
        // *或者是图片的base64字符串（而且字符串还必须是data：image/png；base64，图片转base64字符串）
        // 解决：
        // 解决方案一：文件-》临时内存地址（这个地址只能在js的内存里，不能发给后台）,只是在本地，不能传给后台，谁个blob型的数据
        // 语法：URL.createObjectURL(文件)   URL必须大写，
        // 返回：内存临时地址
        // this.avatar = URL.createObjectURL(files[0])
        // 解决方案二：文件-》base64字符串（此文件是可以传给后台的）
        // 语法：1、创建FileReader对象
        const fr = new FileReader()
        // 2、调用readAsDataUrl函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3、监听fr的onload事件
        fr.onload = e => {
            // 通过e.target.result获取到读取的结果，值是字符串（base64格式字符串）
            this.avatar = e.target.result// 赋予变量，让他显示在img的src里面
        }
        //
      }
    },
   async uploadFn () {
           const { data: res } = await updateUserAvatarAPI(this.avatar)
           console.log(res)
           if (res.code === 0) {
            this.$store.commit('updateUserAvatar', this.avatar)
            this.$message.success(res.message)
           } else {
            this.$message.error('更新图片失败！！')
           }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
