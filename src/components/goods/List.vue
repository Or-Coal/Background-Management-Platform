<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
  </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goAddpage">添加商品</el-button>
            </el-col>
        </el-row>  
        <!-- table表格区 -->
        <el-table :data="goodslist" border stripe>
<el-table-column type="index"></el-table-column>
<el-table-column label="商品名称" prop="goods_name" ></el-table-column>
<el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
<el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
<el-table-column label="商品创建时间"  width="140px">
    <template slot-scope="scope">
        {{scope.row.add_time | dataFormat}}
    </template>
</el-table-column>
<el-table-column label="操作" width="130px">
    <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeById(scope.row.goods_id)"></el-button>
    </template>
</el-table-column>
        </el-table>
      <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      background>
    </el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
data() {
    return {
        //查询参数对象
        queryInfo:{
           query:'',
           pagenum:1,
         pagesize:10    
        },
        // 商品列表
        goodslist:[],
        total:0
    }
},
created(){
this.getGoodsList()
},
methods: {
    // 根据分页获取对应商品列表
 async getGoodsList(){
const{data:res} = await this.$http.get('goods',{ params:this.queryInfo })
if(res.meta.status!==200) return this.$message.console.error('获取商品失败');
this.$message.success('获取商品成功');
console.log(res.data)
this.goodslist = res.data.goods
this.total= res.data.total
 }, 
 handleSizeChange(newSize){
    this.queryInfo.pagesize = newSize
    this.getGoodsList()
},
handleCurrentChange(newPage){
    this.queryInfo.pagenum = newPage
    this.getGoodsList()
},
async removeById(id){
  
  const a = await      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(a!=='confirm') return this.$message.error('已取消删除')
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200)return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
},
goAddpage(){
    this.$router.push('/goods/add')
}
},

}
</script>
<style lang="less" scoped>

</style>