<template>
  <!-- 外部容器 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧图标 -->
      <img class="logoimg" src="../../assets/images/logo.png" alt="" />
      <!--右侧菜单栏 -->
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <img class="logoselfimg" src="@/assets/images/biglogo.png" alt="" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>

    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 信息栏头部 -->
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/biglogo.png" alt="" v-else />
          <span>欢迎{{ nickname || username }}</span>
        </div>
        <!-- 导航信息栏 -->

        <!--
          el-menu:导航栏的菜单
           default-active：当前激活菜单的index
           @open:sub-menu 打开的回调
           @close ：sub-menu关闭的回调
           router:设置上（默认为true），当你点击菜单栏时会以index的值作为路由切换
           分组可以在前边加上一个title
           如果有起嵌套，先写template进行占位，在写内容
           如果没有嵌套，直接写menu-item
           属性没传值的，默认为TRUE
         -->
         <!-- 将默认高亮的不写死，将他绑定为，所在路由的地址 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <!-- 首页 -->
          <template v-for="item in menus">
            <el-menu-item :index=item.indexPath v-if="!item.children" :key="item.indexPath">
              <i :class=item.icon></i>
              <span>{{item.title}}</span>
            </el-menu-item>
            <el-submenu :index=item.indexPath v-else :key="item.index">
              <template slot="title">
                <i :class=item.icon></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="item2 in item.children" :index=item2.indexPath :key="item2.indexpath">
                <i :class=item2.icon></i>
                <span>{{item2.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 主体底部区域 -->
        <el-footer>@www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 经验：在组件的标签上绑定的所有事件，都是自定义事件，需要通过组件内的$emit来触发才行
// 万一组件内不支持这个原生的事件的名字
// 解决：@事件名.native="methods里的方法名"
// .native给组件内根组件内根标签，绑定这个原生的事件
import { mapMutations, mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'
export default {
  name: 'my-layout',
  computed: {
    ...mapGetters(['username', 'user_pic', 'nickname'])
  },
  data () {
    return {
      // 用来保存侧边栏的数据
      menus: []
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    // 退出登录的处理函数
    logoutFn () {
      // 为了让用户体验更好，弹出提示框
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        //   点击了确定
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          //   只要点击确定后才退出
          // 清除vuex
          this.updateToken('')
          // 清除userinfo中的值
          this.$store.commit('updateUserInfo', {})
          // 强制跳转
          this.$router.push('/login')
        })
        // 点击了取消
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出！'
          })
        })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 请求侧边栏数据
    async getMenuListFn () {
      const res = await getMenusAPI()
      // console.log(res)
      this.menus = res.data.data
    }
  },
  // 习惯是不在created上面写async，可以先建一个函数，再调用
  created () {
    this.getMenuListFn()
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #23262e;
}
.el-main {
  background-color: #f2f2f2;
}
.el-footer {
  background-color: #eeeeee;
  text-align: center;
  line-height: 60px;
  font-size: 12px;
}
.logoimg {
  float: left;
}
.el-menu-demo {
  float: right;
}
.el-aside {
  background-color: #23262e;
}
.logoselfimg {
  width: 40px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 10px;
}
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>
