<template>
  <div class="login">
    <div class="center">
      <el-form @submit.native.prevent="login()" label-width="80px" :model="loginForm" ref="login" :rules="rules">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="loginForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="loginForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" @click.native="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          name: '',
          pwd: ''
        },
        rules: {
          name: [{
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }],
          pwd: [{
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          }]
        }
      };
    },
    methods: {
      login() {
        this.$refs.login.validate((validate) => {
          if (validate) {
            this.$axios.post('/loginUser', this.loginForm)
              .then(res => {
                if (res.data && parseInt(res.data.code) === 1) {
                  this.$store.commit('login', res.data.user);
                  this.$message.success('登陆成功');
                  this.$router.push('/home');
                } else {
                  this.$message.error(res.data.msg);
                }
              });
          }
        });
      }
    }
  };

</script>

<style lang="less" scoped>
  .login {
    width: 100vw;
    height: 100vh;
    text-align: center;

    .center {
      position: absolute;
      margin: 0 auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 500px;
      margin-top: 200px;

      /deep/ .el-button {
        width: 100%;
      }
    }
  }

</style>
