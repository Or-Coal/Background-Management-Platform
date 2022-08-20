<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="tianjiafenlei">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
      class="a1"
        border
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
      > 
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-circle-close" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary"  size="mini" icon="el-icon-edit" circle>编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle>删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="50%"
 @close="guanbiduihuakuang">
 <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
     <el-cascader
    v-model="value"
    :options="parentCateList"
    :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children' }"
    @change="parentCateChange" clearablec change-on-select></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 商品分类的数据列表
      catelist: [],
      // 总数居条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      dialogVisible:false,
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addCateFormRules:{},
      parentCateList:[],
      value:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories',{params:this.querInfo})//***********************BUG
      if (res.meta.status !== 200) return this.$message.error("获取商品分类失败")
  this.$message.success("获取商品分类成功");
      //数据列表储存起来
      console.log(res);
      this.catelist = res.data.result;
      // 将总数居条数储存起来
      this.total = res.data.total;
    },
    tianjiafenlei(){
      this.getParentCateList()
        this.dialogVisible=true
    },
    handleSizeChange(newSize){
        this.querInfo.pagesize=newSize
        this.getCateList()
    },
    handleCurrentChange(newPage){
    this.querInfo.pagenum=newPage
        this.getCateList()
        },
        //获取父级分类的数据列表
      async  getParentCateList(){
       const {data:res}=  await this.$http.get('categories',{params:{type:2}})
       if(res.meta.status!==200) return this.$message.error('获取父级分类数据失败')
this.parentCateList= res.data
        },
        parentCateChange(){
if(this.value.length > 0){
  this.addCateForm.cat_pid=this.value[this.value.length -1]
  this.addCateForm.cat_level=this.value.length
}else{
   this.addCateForm.cat_pid=0
  this.addCateForm.cat_level=0
}
        },
        addCate(){
        this.$refs.addCateFormRef.validate(async valid =>{
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !==201){
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
        })  
        this.dialogVisible = false
console.log(this.addCateForm)

        },
        guanbiduihuakuang(){
          this.$refs.addCateFormRef.resetFields()
          this.value =[]
          this.addCateForm.cat_level=0
          this.addCateForm.cat_pid=0
        }
        
  },
};
</script>

<style lang="less" scoped>
.a1{
    margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>