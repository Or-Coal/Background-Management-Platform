# 基于 Vue 的后台管理
#### 开发技术：vue、element-ui、AJAX、axios
#### 开发工具：VSCode
#### 项目介绍：
1. 项目基于商城后台 API 接口，每个页面通过 AJAX 获取、发送数据。
2. 可以实现管理员的登录、注册、商品管理、订单管理、账户管理、用户管理、
权限设置。
3. 管理员可以根据自己的权限对数据进行管理。本系统根据管理员的权限展示
该管理员能够操作的权限的相应栏目，看不到权限之外的栏目。
主要内容：
1. 使用 vue-cli 创建项目，使用 element-ui 和 element-ui 的组件以及自己封
装的组件完成界面。
2. 使用 vue-router 完成页面的跳转。
3. 使用 axios 从数据库拉取、修改数据、设置拦截器对数据进行处理。
4. 使用 Token 配合路由导航守卫，如果没有登录跳转到登录页面。
