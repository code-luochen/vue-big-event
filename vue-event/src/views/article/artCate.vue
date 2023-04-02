<template>
  <div>
    <el-card class="box-card">
      <!-- 标题区域 -->
      <div slot="header" class="clearfix">
        <span>文章分类</span>
        <el-button
          style="float: right; padding: 9px 20px"
          type="primary"
          @click="addCateShowDialogBtnFn"
          >添加分类</el-button
        >
      </div>
      <!-- 表格区域 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column label="序号" width="100" type="index">
          <!--写type为index可以自动将序号改为索引值 -->
        </el-table-column>
        <el-table-column label="分类名称" width="180" prop="cate_name">
        </el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"> </el-table-column>
        <el-table-column label="操作">
          <!-- 在table组件中，用具名插槽可以获得行，scope对象：{row：行对象} -->
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              @click="updateCateBtnFn(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <!--
        el-dialog对话框组件
        title:左上角的标题
        visible：控制对话框是否显示（右侧Vue变量为TRUE显示，为false就隐藏）
        扩展知识点：.sync是Vue2.3版本新增的
        //.sync类似于v-model给子组件实现双向数据绑定
        在Vue2中只能给标签绑定一个v-model，在Vue3中可以绑定多个，加上.sync后可以绑定多个
        加上.sync相当于父子组件双向同步数据一样
        Vue2中可以用多次，但是Vue3中已经被删除了
        before-close：关闭前的回调，在关闭前会弹出，有个参数done ，如果确认就会调用，并关闭，
        函数内部：调用done()就会关闭，什么都不写就不会关闭

     -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogCloseFn"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="cate_name">
          <el-input v-model="addForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="活动名称" prop="cate_alias">
          <el-input v-model="addForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 经验：如果同一按钮，想要做状态区分
// 定义一个标记变量isEdit（true为编辑，false为新增）还要为本次要编辑的数据唯一id值，editId
// 在点击修改时，isEdit改为true，editId保存要修改的数据id
// 在点击新增按钮的时候，isEdit改为false，editId置空
// 在点击保存按钮（确认按钮时），就可以用isEdit变量做区分了
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'
export default {
  naem: 'ArtCate',
  data () {
    return {
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类必须是1-15位的非空字符',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      cateList: [],
      dialogVisible: false, // 决定文章分类对话框-出现（true）/隐藏（false）
      isEdit: true,
      isEditId: ''
    }
  },
  methods: {
    // 获取分类列表
    async getArtCateFn () {
      const { data: res } = await getArtCateListAPI()
      // console.log(res)
      this.cateList = res.data
    },
    // 点击后弹出添加对话框
    addCateShowDialogBtnFn () {
      this.isEdit = false
      this.isEditId = ''
      this.dialogVisible = true
    },
    // 对话框取消按钮
    cancelFn () {
      this.dialogVisible = false
    },
    // 对话框确认按钮
    confirmFn () {
      this.$refs.addRef.validate(async (vaild) => {
        if (vaild) {
          // 通过了校验
          // 提交文章分类的内容
          if (this.isEdit) {
            // 表示编辑状态
            // this.addForm.id = this.isEditId
            // const { data: res } = updateArtCateAPI(this.addForm)
            const { data: res } = await updateArtCateAPI({
              id: this.isEditId,
              ...this.addForm
            })
            if (res.code !== 0) return this.$message.error('更新分类失败！！')
            this.getArtCateFn()
            this.$message.success('更新分类成功！！')
            // console.log(res)
          } else {
            // 表示新增状态
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res !== 0) this.$message.error('添加分类失败！！')
            // 体现了封装函数的好处，可以直接用this来调用，如果是created则不能使用this
            this.getArtCateFn()
            this.$message.success('添加成功！')
            // console.log(res)
          }
          this.dialogVisible = false
        } else {
          this.$message.error('请按要求填写内容！！')
          return false
        }
      })
    },
    // 对话框关闭的回调函数
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改分类处理事件
    // 信息回填小bug（el-form,el-dialog 和数据回填同时使用时才会出现）
    // 问题出在readFields()这个方法
    // dailog的内容是懒加载，即在第一次打开之前，在slot上传递的值是不会渲染到dom元素上的，如果直接在dialog中赋值，由于先执行同步代码，
    // 这时当readFidelis（）清空数据表单会记录当前同步赋的初始值，所以每次关闭都是第一同步赋予的
    // 解决方法：让整个页面加载完后在赋值，这时readFields（）这个方法就记录原本的值
    updateCateBtnFn (obj) {
      // obj的值里面包含了信息对象
      this.isEdit = true
      this.isEditId = obj.id
      this.dialogVisible = true
      // 信息回填，在点击修改按钮时将原内容显示
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除分类处理函数
   async delCateFn (obj) {
       const { data: res } = await delArtCateAPI(obj.id)
       if (res.code !== 0) return this.$message.error('删除失败！')
        this.$message.success('删除成功！！')
       this.getArtCateFn()
}
  },
  created () {
    // 获取文章分类的内容
    this.getArtCateFn()
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
}
.el-form {
  width: 500px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-content: center;
  text-align: center;
  line-height: 34px;
}
.demo-ruleForm {
  width: 100%;
}
</style>
