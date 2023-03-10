<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title"><i class="el-icon-s-data"></i>云E办系统</div>
       <div>
         <el-button type="text"
                    icon="el-icon-user-solid"
                    size="medium"
                    @click="goChat"
                    style="margin-right:8px;color: black"></el-button>
         <el-dropdown class="userInfo" @command="commandHandler">
                  <span class="el-dropdown-link" >
                   {{user.name}}
                    <i><img :src="user.userFace"></i>
                  </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
             <el-dropdown-item command="setting">设置</el-dropdown-item>
             <el-dropdown-item command="logout">注销登录</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>
       </div>
      </el-header>

      <el-container style="height: 680px">
        <el-aside width="240px">
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item,index) in routes"
                        :key="index"
                        v-if="!item.hidden">
              <template slot="title">
                <i :class="item.iconCls" style="color: deepskyblue;margin:0 17px 0 15px; "></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path"
                            v-for="(children,indexj) in item.children" :key="indexj">{{ children.name }}
              </el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="honeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到云E办系统
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import store from "@/store";

export default {
  name: "Home",
  data() {
    return {
     // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return store.state.routes;
    },
    user(){
      return this.$store.state.currentAdmin;
    }
  },
  methods: {
    goChat(){
      this.$router.push("/chat")
    },
    errorHandler() {
      return true
    },
    commandHandler(command) {
      if (command == "logout") {
        this.$confirm('此操作将退出登入, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest("/logout")
          window.sessionStorage.removeItem("tokenStr");
          window.sessionStorage.removeItem("user");
          //清空菜单
          store.commit('initRoutes', [])

          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      }
      if (command=='userinfo'){
        this.$router.push('/userinfo')

      }


    }
  }

}
</script>

<style>

.homeRouterView{
  margin-top: 15px;
}

.honeWelcome{
  height: 600px;
  background: url("../assets/8.png")  100% no-repeat;
  text-align: center;
  font-size: 45px;
  font-family: 华文新魏;
  color: #07e2ff;
  padding-top: 40px;
}

.homeHeader {
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文新魏;
  color: #ffffff;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 10px;
}


</style>