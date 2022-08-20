<template>
  
      <el-container class="home-container">
    <!-- 头部区域 -->
  <el-header>
      <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
  </el-header>
  <!-- 页面主体区 -->
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 折叠 -->
      <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
    <el-menu
      background-color="#313743"
      text-color="#fff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
      active-text-color="#3176C3">
      <!-- 一级菜单 -->
      <el-submenu :index="'/'+item.path +''" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
          </template> 
            <!-- 二级菜单 -->
 <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
 @click="saveNavState('/'+subItem.path)">
          <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template> 
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
</el-aside>
    <!-- 右侧内容主题 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
 
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      // 左侧菜单数据
      menulist:[],
      iconsObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-3702mima',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-tijikongjian'
      },
      // 是否折叠
      isCollapse:false,
      // 被激活的链接地址
      activePath:'',
    }
  },
  created(){
this.getMenuList(),
this.activePath = window.sessionStorage.getItem('activePath')
  },   
  methods: {
    logout() {
      window.sessionStorage.clear(), this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList(){
const {data:ref} = await this.$http.get('menus')
if(ref.meta.status !==200) return this.$message.error(ref.meta.msg)
this.menulist = ref.data
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse(){
this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
window.sessionStorage.setItem('activePath',activePath)
this.activePath = activePath
    }
  },
};
</script>

<style lang='less' scope>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #313743;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button{
  background-color:#475163 ;
  font-size: 10px;
  line-height:24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上时变为小手
  cursor: pointer;
}
</style>