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
        <el-form-item label="验证码" prop="verCode">
          <el-input v-model="loginForm.verCode" type="code"></el-input>
        </el-form-item>
        <div>
          <i @click="getPcCode()" class="dib code-img hv-cp">
            <img :src="codeImg" alt="">
            <!-- <img :src="codeImg " alt=""> -->
          </i>
        </div>
        <el-form-item>
          <el-button native-type="submit" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import global from '../global/global.js'

  export default {
    name: 'login',
    data() {
      return {
        codeImg: '',
        loginForm: {
          verCode: '',
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
          }],
          verCode: [{
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
          }]
        }
      };
    },
    mounted() {
      setTimeout(() => {
        this.getPcCode();
        
      }, 1000);
    },
    methods: {
      /**获取验证码 */
      getPcCode() {
        this.$axios.post('/getPcCode', {}, {
          responseType: 'blob'
        })
        .then(res => {
          console.log('res', res);
          if(!res.data) return;
          // blob :
          let blob = new Blob([res.data], {type: 'video/*'})
          let url =  window.URL.createObjectURL(blob);

          //base64:
          // let sF = String.fromCharCode(...new Uint8Array(res.data))
          // let url = 'data:image/jpeg;base64,' + btoa(sF);
          console.log('url', url);
          this.codeImg = url;

        })
        
        // this.codeImg = global.BASEURL + '/getPcCode?' + Math.ceil(Math.random()*10);
      },

      login() {
        this.$refs.login.validate((validate) => {
          if (validate) {
            let propsData = {
              "name": this.loginForm.name,
              "pwd": this.loginForm.pwd,
              "verCode": this.loginForm.verCode,
            }
            this.$axios.post('/loginUser', propsData)
              .then(res => {
                console.log('res', res);
                if (res.data && parseInt(res.data.code) === 1) {
                  this.$store.commit('login', res.data.user);
                  this.$message.success('登陆成功');
                  this.$router.push('/home');
                } else {
                  this.$message.error(res.data.msg);
                  this.getPcCode();
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
