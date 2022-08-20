<template>
  <div>
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 提示区 -->
        <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon :closable="false">  
  </el-alert>
  <!-- 步骤条 -->
  <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
 <el-tabs v-model="activeIndex" @tab-click="handleClick" tab-position="left" :before-leave="beforeTabLeave">
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name" ></el-input>
      </el-form-item>
       <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item> 
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item> 
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
       <el-cascader
    v-model="addForm.goods_cat"
    :options="catelist"
    :props="{ expandTrigger: 'hover' ,
    label:'cat_name',value:'cat_id'
    ,children:'children'}"
    @change="handleChange"></el-cascader> 
</el-form-item>    
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <!-- 渲染表单的Item项 -->
      <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
          <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox border :label="cb"  v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
      <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>  
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <!-- action表示图片要上传的后台API地址 -->
      <el-upload
      :on-success="handleSuccess"
      :on-remove="handleRemove"
  :headers="headerObj"
  action="http://127.0.0.1:8888/api/private/v1/upload"
  :on-preview="handlePreview"
  
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
      <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
      </el-tab-pane>
  </el-tabs>
  </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
  title="图片预览"
  :visible.sync="p1"
  width="50%">
<img :src="PreviewPath" alt="" class="c1">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
data() {
    return {
      activeIndex:0,
      // 添加商品的表单数据对象
      addForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        // 图片的数组
        pics:[],
        // 商品所属的分类数组
        goods_cat:[],
        // 商品详情介绍
        goods_introduce:'',
        attrs:[]


      },
      addFormRules:{
        goods_name:[
          {required:true,message:'请输入商品名称',trigger:'blur'}
        ],
                goods_price:[
          {required:true,message:'请输入商品价格',trigger:'blur'}
        ],
                goods_weight:[
          {required:true,message:'请输入商品重量',trigger:'blur'}
        ],
                goods_number:[
          {required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_cat:[
          {required:true,message:'请选择商品分类',trigger:'blur'}
        ]
      },
      // 商品分类列表
      catelist:[],
      // 动态参数列表数据
      manyTableData:[],
      // 静态属性列表数据
      onlyTableData:[],
      // 图片上传组件的headers请求头对象
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      PreviewPath:'',
      p1:false,
    }
},
created(){
this.getCateList()
},
methods: {
   async getCateList(){
    const{data:res}= await this.$http.get('categories')
    if(res.meta.status!==200) return this.$message.console.error('获取商品分类数据失败');
    this.catelist = res.data
    console.log(this.catelist)
   } ,
  //  级联选择器选中项变换出发
   handleChange(){
     if(this.addForm.goods_cat.length!==3){
       this.addForm.goods_cat=[]
     } 
     console.log(this.addForm.goods_cat)
   },
   beforeTabLeave(a,b){
 if(b==='0' && this.addForm.goods_cat.length!==3){
   this.$message.error('请先选择商品分类')
   return false
 }
   },
  async handleClick(){
    //  证明访问的是动态参数面板
     if(this.activeIndex==='1'){
      const{data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
      if(res.meta.status !==200){
        return this.$message.error('获取动态参数列表失败')
      }
      this.manyTableData = res.data
      console.log(res.data)
      res.data.forEach(item=>{
item.attr_vals = item.attr_vals.length===0 ? []: item.attr_vals.split(',')

      })
        
     }else if(this.activeIndex==='2'){
      const{data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
if(res.meta.status !==200){
        return this.$message.error('获取动态参数列表失败')
      } 
      console.log(res.data)
      this.onlyTableData=res.data
     }

   },
  //  处理图片预览效果
   handlePreview(file){
this.PreviewPath = file.response.data.url
this.p1=true
   },
 
  //  监听图片上传成功的事件
   handleSuccess(a){
     const picInfo= {pic:a.data.tmp_path}
     this.addForm.pics.push(picInfo)
   },
  //  处理移除图片操作 
   handleRemove(a){
     const picInfo= a.response.data.tmp_path
this.addForm.pics.splice(this.addForm.pics.findIndex(x=>x.pic===picInfo),1)
   },
   add(){
     this.$refs.addFormRef.validate(async valid=>{
       if(!valid){
         return this.$message.error('请填写必要的表单项')
       }
       const form=_.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        this.manyTableData.forEach(item=>{
          const newInFo = {attr_id:item.attr_id,
          attr_value:item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInFo)
        })
        this.onlyTableData.forEach(item=>{
          const newInFo = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInFo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
       const {data:res} =await this.$http.post('goods',form)
       if(res.meta.status!==201) return this.$message.error('添加商品失败')
       this.$message.success('添加商品成功')
       this.$router.push('/goods')
     })
   }
   
},
computed:{
  cateId(){
    if(this.addForm.goods_cat.length === 3){
      return this.addForm.goods_cat[2]
    }
    return null
  }
}

}
</script>

<style lang="less" scoped>
.el-checkbox{ 
  margin: 0 5px 0 0 !important;
}
.c1{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>