<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/love.jpg" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFromRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_form"> 
        <el-form-item  prop="username">
          <el-input prefix-icon="iconfont icon-users" v-model="loginFrom.username">
            <!-- 在前部加一个方块小图标 -->
           <!-- <i class="el-icon-user-solid" slot="prepend"></i> -->
          </el-input>
        </el-form-item >
             <el-form-item label="" prop="password">
               <!-- show-password="password"可以隐藏密码也可以看密码 -->
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginFrom.password" type="password"></el-input>
        </el-form-item >
            <el-form-item class="btns" >
            <el-button type="primary" @click="login" >登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
        
        
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      loginFrom:{
        username:'admin',
        password:'123456'
      },
      // 这是表单的验证规则对象
      loginFromRules:{
        // 验证用户名是否合法
        username:[
          {required:true,message:"请输入登录名称",trigger:"blur"},
          {min:3,max:5,message:"字符在3到5之间",trigger:"blur"}],
        // 验证密码是否合法
        password:[
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:10,message:"字符在6到10之间",trigger:"blur"}
        ]
      }
    }
  },
  methods: {
      resetLoginFrom(){
        this.$refs.loginFromRef.resetFields()
      },
      login(){
        this.$refs.loginFromRef.validate(async valid=>{
          if(!valid) return;
          console.log(valid)
          const{data:res} = await this.$http.post('login',this.loginFrom);
         if(res.meta.status !==200)return this.$message.error('登陆失败');
         this.$message.success("登陆成功")
         window.sessionStorage.setItem("token",res.data.token)
         this.$router.push('/home')
        })
      }
    },
}
</script>

<style  lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: aquamarine;
  }
}
.btns{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

