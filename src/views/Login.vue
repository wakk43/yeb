<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="正在登入..."
             ref="loginForm"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">登入系统</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input type="password" auto-complete="false" v-model="loginForm.password"
                  placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item prop="code" label="验证码">
        <el-input type="text" auto-complete="false" style="width:180px;margin-right: 5px" v-model="loginForm.code"
                  placeholder="点击图片更换验证码"></el-input>
        <img class="imgd" :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>

      <el-checkbox class="loginRemember" v-model="checked">记住我</el-checkbox>
      <el-button type="primary"
                 style="width: 100%;height: 35px"
                 @click="submitLogin">登入
      </el-button>


    </el-form>
  </div>

</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time=' + new Date(),
      checked: true,
      loading: false,

      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }

    }

  },
  methods: {
    //更换图片
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    //登入事件
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", this.loginForm).then(res => {
            if (res) {
              this.loading = false;
              const tokenStr = res.obj.tokenHead + res.obj.token;
              window.sessionStorage.setItem('tokenStr', tokenStr)
              //跳转首页
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            } else {
              this.loading = false;
            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      })
    }
  }
}
</script>

<style>

.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;

  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  font-size: 25px;
  margin: 20px auto 15px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.imgd {
  width: 100px;
  height: 25px;
}

</style>