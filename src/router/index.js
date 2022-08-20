import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () =>import(/* webpackChunkName:"login_home_welcome" */ '../components/Login')
// import Home from '../components/Home'
const Home = () =>import(/* webpackChunkName:"login_home_welcome" */ '../components/Home')

// import Welcome from '../components/Welcome'
const Welcome = () =>import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome')

// import Users from '../components/user/Users'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
const Users = () =>import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/user/Users')
const Rights = () =>import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/power/Rights')
const Roles = () =>import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/power/Roles')

// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
const Cate = () =>import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Cate')
const Params = () =>import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Params')

// import List from '../components/goods/List'
// import Add from '../components/goods/Add'
const List = () =>import(/* webpackChunkName:"List_Add" */ '../components/goods/List')
const Add = () =>import(/* webpackChunkName:"List_Add" */ '../components/goods/Add')

// import Order from '../components/order/Order'
// import Report from '../components/report/Report'
const Order = () =>import(/* webpackChunkName:"Order_Report" */ '../components/order/Order')
const Report = () =>import(/* webpackChunkName:"Order_Report" */ '../components/report/Report')

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      // 自动重定向到login
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component: Login
    },
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users

      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Order
      },
      {
        path:'/reports',
        component:Report
      }
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
export default router
