<template>
  <div>
    <el-card class="box-card">
      <!-- 标题区域 -->
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索头区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetFn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发布文章区域 -->
        <div>
          <el-button
            style="margin-top: 2px"
            type="primary"
            size="small"
            @click="showPubDialogFn"
            >发表文章</el-button
          >
        </div>
      </div>
      <!-- 文章列表区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column prop="title" label="文章标题">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类"> </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot="scope">
            <span> {{ $formatDate(scope.row.pub_date) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="180">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="removeFn(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域按钮-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--发表文章dialog对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 对话框中的内容区域 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类 "
            style="width: 100%"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.cate_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="pubForm.content"
            @blur="contentChangeFn"
          ></quill-editor>
        </el-form-item>
        <!-- 文章封面标签 -->
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="@/assets/images/cover.jpg"
            class="cover-img"
            ref="imgRef"
            alt=""
          />
          <!-- 选择文件的弹框，默认是隐藏的 -->
          <!-- input 中accept属性是用于限定上传的文件格式 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            @change="changeCoverFn"
            ref="iptFileRef"
          />
          <br />
          <!-- 用来显示文件选择弹框 -->
          <el-button type="text" @click="selCover">+1 选择封面</el-button>
        </el-form-item>
        <!-- 发布和存为草稿的按钮 -->
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 文章详情页的dialog的对话框 -->
    <el-dialog title="文章预览" :visible.sync="dialogvisible" width="80%">
      <!-- 标题区域 -->
      <h1 class="title">{{ artDetail.title }}</h1>
      <!-- 文章信息区域 -->
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分隔符 -->
      <el-divider></el-divider>
      <!-- 内容区域 -->
      <!-- 文章的封面 -->
      <img
        v-if="artDetail.cover_img"
        :src="BaseURL + artDetail.cover_img"
        alt=""
      />
      <!--后端返回图片地址的经验：
        为何返回的图片地址是半截？
        原因：因为服务器的域名是来回变化的，所以数据库中里的地址只有相对路径
        要求：当前端需要请求此图片的时候，后端告诉你图片文件的真身服务器域名，前端自己拼接前缀
      -->
      <!-- 积累知识：
        组件创建时，会用data里的默认值，让标签中的值先渲染一遍
        你的网络请求回来时，data数据发生变化，会让原来的dom元素发生更新
        小问题：第一次渲染的时候无值可能会导致一些报错，但是效果还是出来了
        解决1：v-if先不让无值的代码指行
        解决2：添加一个空字符串
      -->
      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  uploadArticleAPI,
  getArticleListAPI,
  getArtDetailAPI,
  removeArticleAPI
} from '@/api'
import { baseURL } from '@/utils/request'
// 通过引入的这种方式，webpack会将图片转换成base64字符串/或者是打包后的临时地址（根据图片的大小选择转换的格式）
// 小图片会被转换成base64格式的图片，大图片，会将图片拷贝换个路径给img的src显示（运行时）
// 在js代码中不能直接写相对路径，webpack在打包时会把他当做字符串，找不到图片的路径，需要使用引入的方式，webpack会自动的打包和转换
// 解决：在js中引入图片就用import引入，让webpack把他当做模块数据，对其进行打包转换
// 注意：只有是相对路径的图片地址是不能在js中直接写的，如果是http://开头的外链地址，可以在js中直接写
import defaultImg from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 图片的基地址
      BaseURL: baseURL,
      // 查询参数对象
      q: {
        pagenum: 1, // 默认那第一页数据
        pagesize: 2, // 表示第一页需要几条数据
        cate_id: '', // 分类的文章id
        state: '' // 分类文章状态
      },
      // 存储分类的信息
      cateList: [],
      dialogVisible: false, // 控制发布文章对话框出现隐藏（true/false）
      dialogvisible: false, // 控制文章详情页对话框的出现（true/false）
      pubForm: {
        // 发布文章-表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: null, // 选择文章封面的文件，后端要求传递的是一个文件
        state: '' // 文章的发布状态，可选值有两个：草稿和已发布，后台要求写的，一定要传
      },
      pubFormRules: {
        // 发布文章的表单验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章的标题长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        content: [
          // 为何输入了内容，校检还不能去除校检
          // 原因：
          // content对应quill-editor富文本编辑器，他不是el的表单元素，不能使用他的校检功能
          // el-input 等输入框字在blur事件时  进行校检
          // 单选框和多选框，下拉菜单，是在change事件时被校检
          // 解决：
          // 自己给quill-editor绑定change事件（在文档里查他支持的change事件）
          // 在事件处理函数中用el-form组件对象内,调用某个校检规则,在重新执行
          { required: true, message: '请选择文章内容', trigger: 'blur ' }
        ],
        cover_img: [
          { required: true, message: '请选择文章封面', trigger: 'blur ' }
        ]
      },
      artDetail: {}, // 存储文章详情
      artList: [], // 存储发布的文章分类信息
      total: 0 // 记录文章总共的数据条数
    }
  },
  methods: {
    // dialog框关闭前的回调函数，会把dialog的关闭停掉
    handleClose (done) {
      this.$confirm('确认关闭，此操作将导致文章信息丢失，是否继续？', '提示', {
        type: 'warning'
      })
        .then((_) => {
          done()
        })
        .catch((err) => err) // 将错误的信息做为一个成功的变量值，重新返回回去
    },
    // dialog对话框的关闭和关闭前的函数是一个异步执行的操作，可以使用async和await来修饰,由于await只能获得成功的情况，如果需要得到错误的信息，用catch来进行捕获
    showPubDialogFn () {
      this.dialogVisible = true
    },
    // 获取文章分类的接口
    async getArtCateListFn () {
      const { data: res } = await getArtCateListAPI()
      // console.log(res)
      this.cateList = res.data
    },
    // 获取文章封面的处理函数
    selCover () {
      // 打开文件选择框的默认点击事件
      this.$refs.iptFileRef.click()
    },
    // 文件选择改变后的处理函数
    changeCoverFn (e) {
      const files = e.target.files // 返回的是一个伪数组
      if (files.length !== 0) {
        // 证明选择了文件
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 将这个文件的格式转换成base64
        // 使用其自带的监听器，监听文件的变化
        this.pubForm.cover_img = files[0]
        //  将选中后的图片通过前端预览
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      } else {
        this.pubForm.cover_img = null
        // 将文件的默认图标显示为进行显示
        this.$refs.imgRef.setAttribute('src', defaultImg)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布和存为草稿的点击处理事件
    pubArticleFn (state) {
      // 由于有表单的规则校验，所以需要先进行整个表单的校检
      this.$refs.pubFormRef.validate(async (vaild) => {
        // 判断表单校检不成功的情况
        if (!vaild) return this.$message.error('请按求填写内容！')
        // 判断是否选择了文章封面
        if (!this.pubForm.cover_img) {
          return this.$message.error('请选择文章的封面！')
        }
        this.pubForm.state = state
        // console.log(this.pubForm)
        // 发布文章的api接口
        const fd = new FormData() // 准备一个表单数据对象容器 FormData类是HTML5新出的专门为了装文件内容和其他参数的一个容器
        // 往容器中添加的方式是 fd.append('参数名',值)，这是固定的写法，相当于将这些参数，存放到这个参数中
        fd.append('title', this.pubForm.title)
        fd.append('cate_id', this.pubForm.cate_id)
        fd.append('content', this.pubForm.content)
        fd.append('cover_img', this.pubForm.cover_img)
        fd.append('state', this.pubForm.state)
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) {
          this.$message.error('发布失败！')
          return false
        }
        // console.log(res)
        this.$message.success('发布文章成功！')
        // 关闭dialog对话框
        this.dialogVisible = false
        // 再次请求文章列表数据
        this.getArticleListFn()
      })
    },
    // 校检content内容
    // 富文本编辑器内容改变了，触发次此方法
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // dialog关闭前清空表单的处理函数
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      // 由于封面没有收到v-model的影响，所以表单重置时对他无效，需要再次给他赋值
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 初始化文章列表
    async getArticleListFn () {
      const { data: res } = await getArticleListAPI(this.q)
      // console.log(res)
      // 将获取到的数据保存起来
      this.artList = res.data
      this.total = res.total
    },
    // 分页，每页条数改变时触发
    handleSizeChange (val) {
      // val是当前页面需要的数据条数
      // 因为Pagination的标签已经加了.sync，子组件内会双向绑定到右侧的vue变量上（q对象中的值已经改变了）
      // 如果不心，可以再写一遍

      // 会存在bug
      // 问题：先点击最后一个页码，切换每页显示条数2->3，总数不够，分页只能分到2
      // 每页条数改变了，页码从3到2，2个事件都触发了
      // 偶发性的bug：有的时候自动回到第二页有数据，有的时候没有数据
      // 知识点：两个网络请求一起发，并发执行，谁先回来不一定，
      // 原因：所以有可能是第二页数据先回来有值铺设，第三页的3条数据再回来，空数组所以页面就是空的
      // 解决：当切换每页显示的条数，我们把当前的页码设置为1，而且标签里要设置

      this.q.pagesize = val
      this.q.pagenum = 1 // 请求第一页的数据是一定有的，这时页码改变的函数，也是请求的第一页数据，两个就不会产生冲突
      this.getArticleListFn()
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
      // val 是改变页码对应的值
      this.q.pagenum = val
      this.getArticleListFn()
    },
    // 筛选按钮的点击事件
    choseFn () {
      // 目的：当有了筛选条件，我想让页码回归1，每页的条数回归2
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleListFn()
    },
    // 筛选重置按钮
    resetFn () {
      // 将其复原
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      // 调用列表数据
      this.getArticleListFn()
    },
    // 文章标题的点击事件-》为了查看文章的详情
    async showDetailFn (id) {
      // console.log(this.artList)
      this.dialogvisible = true
      const { data: res } = await getArtDetailAPI(id)
      console.log(res)
      this.artDetail = res.data
    },
    // 删除文章处理事件
    async removeFn (id) {
      const { data: res } = await removeArticleAPI(id)
      if (res.code !== 0) return this.$message.error('删除失败！!')
      this.$message.success('删除文章成功！！')
      // 数组里只保存当前页的数据，不保存其他页的数据
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          // 保证pagenum的页数大于一
          this.q.pagenum--
        }
      }
      this.getArticleListFn()
      // 问题：在最后一页，删除最后一条时，虽然页码能回到上一页，但是数据没有出现
      // 原因：发现network里参数，pagenum没有改变，当再去请求时用的是原来的pagenum去请求，没有数据
      // 解决：在调用接口之前，对pagenum做一下判断和处理
    }
  },
  created () {
    this.getArtCateListFn() // 得到分类列表
    this.getArticleListFn() // 得到分类文章列表
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
}
.el-form {
  width: 100%;
}

.demo-ruleForm {
  width: 100%;
}
.search-box {
  display: flex;
  justify-content: space-around;
  // align-items: center;
}

/deep/ .ql-editor {
  min-height: 300px;
}
.cover-img {
  height: 280px;
  width: 400px;
  // object-fit:适配图片大小的属性，一般值为cover
  object-fit: cover;
}
.title {
  text-align: center;
  margin: 0 0 10px 0;
  color: #000;
  font-size: 24px;
}
.info span {
  font-size: 12px;
  margin-right: 20px;
}
</style>
