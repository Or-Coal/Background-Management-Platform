<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-crad>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="jiaosexinxi = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="i1.id"
              :class="[`bdbottom`, i1 === 0 ? 'bdtop' && 'vcenter' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1.id)" closable>
                  {{ item1.authName }}
                </el-tag>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="shanchu(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRigghtDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-crad>
    <!-- 添加用户区 -->
    <el-dialog title="添加角色" :visible.sync="jiaosexinxi" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormref"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="mingcheng">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="miaoshu">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jiaosexinxi = false">取 消</el-button>
        <el-button type="primary" @click="addjiaose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="fenpeiquanxian" width="50%" @close="qingkong">
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
      default-expand-all
      :default-checked-keys="defkeys"
      ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiquanxian = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },
      jiaosexinxi: false,
      rules: {
        mingcheng: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        miaoshu: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
      },
      fenpeiquanxian: false,
      // 所有权限数据
      rightslist: [],
      // 树形控件的树形绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选中的节点id值
      defkeys:[],
      roleId:'' 
    
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.console.error("获取角色列表失败");
      }
      this.rolelist = res.data;
    },
    async addjiaose() {
      const { data: res } = await this.$http.post("roles", {
        roleName: this.ruleForm.roleName,
        roleDesc: this.ruleForm.roleDesc,
      });
      if (res.meta.status !== 201) return this.$message.error("添加用户失败");
      this.$message.success("添加用户成功");
      // this.addjiaose()
      this.jiaosexinxi = false;
      this.getRolesList();
    },
    async shanchu(id) {
      const conficmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (conficmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getRolesList();
    },
    // 根据id删除对应的权限
    async removeRightById(r1, r2) {
      //弹框提示是否要删除
      const conficmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (conficmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${r1.id}/rights/${r2}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      r1.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRigghtDialog(role) {
      this.roleId=role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("权限数据获取失败");
      this.rightslist = res.data;
      console.log(res.data);
      // 递归获取三级节点id
      this.diguihanshu(role,this.defkeys)
      this.fenpeiquanxian = true;
    },
     //通过递归的形式，获取角色下所有三级权限的id并保存到数组defkeys
diguihanshu(node,arr){
if(!node.children){
return arr.push(node.id)
}
node.children.forEach(item =>{
  this.diguihanshu(item,arr)
})
    },
    qingkong(){
      this.defkeys =[]
    },
    // 点击为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // join()函数把数组拼接成字符串，可以指定符号进行分隔
        const idStr = keys.join()
      const {data:res}= await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !==200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
this.getRolesList()
this.fenpeiquanxian=false
    }
  },
};
</script>

<style lang="less" scoped>
.bdtop {
  border: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>