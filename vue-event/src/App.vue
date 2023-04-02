<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
// import { getUserInfoApi } from './api'
export default {
  name: 'my-app',
  data () {
    return {

    }
  }

  // 测试一下接口
  // created () {
  //   getUserInfoApi(this.$store.state.token).then((res) => {
  //     console.log(res)
  //   })
  // }

}
</script>

<style lang="less" scoped>
.container{
  height: 100%;
}
</style>
