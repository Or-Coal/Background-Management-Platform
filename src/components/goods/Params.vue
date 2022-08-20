<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 头部警告区 -->
    <el-alert
    title="注意:只允许为第三级分类设置相关参数"
    type="warning"
    :closable="false"
    show-icon>
  </el-alert>
  <!-- 选择商品分类 -->
  <el-row class="cat_opt">
    <el-col>
      <span>选择商品分类:</span>
      <!-- 级联选择框 -->
      <el-cascader
    v-model="jilian"
    :options="catlist"
    :props="cateProps"
    @change="handleChange"
    size="mini"></el-cascader>
    </el-col>
  </el-row>
  <!-- tab页签区 -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled="isbtndisab" @click="tianjiacanshu=true">添加参数</el-button>
      <!-- 动态属性表格 -->
      <el-table :data="dongtai" border stripe>
        <!-- 索引列 -->
<el-table-column type="expand"></el-table-column>

<el-table-column type="index"></el-table-column>
<el-table-column label="参数名称" prop="attr_name"></el-table-column>
<el-table-column label="操作">
  <template slot-scope="scope">
    <el-button type="primary" plain  size="mini" @click="bianji(scope.row.attr_id)">编辑</el-button>
  <el-button type="danger" plain  size="mini" @click="shanchucanshu(scope.row.attr_id)">删除</el-button>
  </template>
</el-table-column>

      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
       <el-button type="primary" size="mini" :disabled="isbtndisab" @click="tianjiacanshu=true">添加参数</el-button>
      <!-- 动态属性表格 -->
      <el-table :data="jingtai" border stripe>
        <!-- 索引列 -->
<el-table-column type="expand"></el-table-column>

<el-table-column type="index"></el-table-column>
<el-table-column label="属性名称" prop="attr_name"></el-table-column>
<el-table-column label="操作">
  <template slot-scope="scope">
    <el-button type="primary" plain  size="mini" @click="bianji(scope.row.attr_id)">编辑</el-button>
  <el-button type="danger" plain  size="mini" @click="shanchucanshu(scope.row.attr_id)">删除</el-button>
   </template>
</el-table-column>

      </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>
    <!-- 添加参数弹窗 -->
    <el-dialog
  :title="'添加' + titleText"
  :visible.sync="tianjiacanshu"
  width="50%"
  @close="handleClose">
  <!-- 添加参数对话框 -->
  <el-form :model="addFrom" :rules="addFromrules" ref="addFromRef" label-width="100px" >
  <el-form-item label="属性绑定" prop="attr_name">
    <el-input v-model="addFrom.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="tianjiacanshu = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加修改弹窗 -->
 <el-dialog
  :title="'修改' + titleText"
  :visible.sync="xiugaiduihuakuang"
  width="50%"
 @close="handleClose2">
  <!-- 修改参数对话框 -->
  <el-form :model="xiugaicanshu" :rules="xiugaicanshurules" ref="xiugaicanshuRef" label-width="100px" >
  <el-form-item label="修改参数" prop="attr_name">
    <el-input v-model="xiugaicanshu.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="xiugaiduihuakuang = false">取 消</el-button>
    <el-button type="primary" @click="xiugaiduihuakuangqueding">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
data() {
    return {
      // 商品分类列表
       catlist:[],
       cateProps:{
         value:'cat_id',
         label:'cat_name',
         children:'children'
       } ,
       jilian:[],
      //  被激活的页签名称
       activeName:'many',
       jingtai:[],
       dongtai:[],
       tianjiacanshu:false,
       addFrom:{attr_name:''},
      //  添加表单验证规则对象
       addFromrules:{},
       xiugaiduihuakuang:false,
       xiugaicanshu:{attr_name:''},
       xiugaicanshurules:{},
    }
},
created(){
  this.getCateList()
},
methods:{
 async getCateList(){
 const {data:res}=  await this.$http.get('categories')
 if(res.meta.status!==200) return this.$message.console.error('获取商品类型失败');
this.catlist = res.data
  },
 handleChange(){
  this.huoqushuxing()
 
  },
  // tab页签点击事件处理函数
  handleClick(){
 this.huoqushuxing()
  },
   async huoqushuxing(){
      if(this.jilian.length !==3){
      this.jilian = []
      this.jingtai=[]
      return
    }
  const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
   res.data.forEach(item => {
    //  item.attr_vals=item.attr_vals.split('')
   console.log(res.data)

   })
    if(this.activeName==='many'){
  this.dongtai=res.data
  }else{
    this.jingtai=res.data
  }
  },
  // 监听对话框的关闭事件,关闭之前调用，延缓关闭
  handleClose(){
    this.$refs.addFromRef.resetFields()
     this.tianjiacanshu = false
  },
  addParams(){
    this.$refs.addFromRef.validate(async valid=>{
      if(!valid) return
      const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addFrom.attr_name,attr_sel:this.activeName})
      if(res.meta.status!==201) return this.$message.error('添加参数失败')
      this.$message.success('添加参数成功')
      this.tianjiacanshu = false
      this.huoqushuxing()
     
    })
  },
async bianji(id){
   this.xiugaiduihuakuang=true
  const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
  if(res.meta.status!==200){
    return this.$message.error('获取参数信息失败！')
  }
  this.xiugaicanshu = res.data
},
handleClose2(){
  this.$refs.xiugaicanshuRef.resetFields()
  this.xiugaiduihuakuang = false
},
xiugaiduihuakuangqueding(){
  this.$refs.xiugaicanshuRef.validate(async valid=>{
    if(!valid) return
    const {data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${this.xiugaicanshu.attr_id}`,{attr_name:this.xiugaicanshu.attr_name,attr_sel:this.activeName})
    if(res.meta.status!==200) return this.$message.error('修改参数失败')
    this.$message.success('修改参数成功')
    this.xiugaiduihuakuang = false
    this.getCateList()

  })
},
async shanchucanshu(id){
  const a=await this.$confirm('此操作将永远删除该参数，是否继续?','提示',{
    confirmButtonText:'确定',
    cancelButtonText:'取消',
    type:'warning'
  }).catch(err=>err)
  if(a!=='confirm'){
    return this.$message.info('已取消删除')
  }
  const{data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
  if(res.meta.status===200)return this.$message.success('删除成功')
}
 
  },
   computed:{
    // 如果按钮需要被禁用,则返回true,否则返回false
    isbtndisab(){
     if(this.jilian.length!==3){
        return true
      }
      return false
    },
    // 当前分类的三级id
    cateId(){
      if(this.jilian.length===3){
        return this.jilian[2]
      }
    },
    titleText(){
      if(this.activeName === 'many'){
        return'动态参数'
      }
      return '静态属性'
    }
   
} 
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}

</style>