<template>
  <div class="right">
    <div class="right-title">
      <div class="top">
        <div class="icons">
          <!-- <img src="../assets/images/minus.png" alt=""> -->
        </div>
        <div class="user">
          <i class="dib user-img"><img src="../assets/images/avatar.png" alt></i>
          <el-dropdown>
            <span class="el-dropdown-link hv-cp">
              <span>{{userInfo.uname}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="signOut()">退出登入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 面包屑 -->
      <div class="bottom" v-if="activeIndex !== '/home'">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in pathInfo.meta.breadList"
            :key="index"
            :to="item.path"
            v-if="!item.type || pathInfo.params.type === item.type"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import util from "../util/util";

import {mapState} from 'vuex';

export default {
  name: "rightContent",
  props: {
    activeIndex: {
      type: String
    },
    pathInfo: {
      default: Object
    }
  },

  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    console.log('this.userInfo', this.userInfo);
    // 计算rightContent的实际高度
    window.onresize = () => {
      this.repaint();
    };
    window.addEventListener("resize", this.repaint);
    this.repaint();
  },
  methods: {
    /**
     * 退出登入
     */
    signOut() {
      this.$store.commit('login', {});
      this.$message.success('成功登出');
      this.$router.push({
        path: '/login'
      })
    },

    repaint() {
      this.$nextTick(() => {
        const topHeight = parseInt(
          util.getStyle(this.$el.querySelector(".right-title"), "height")
        );
        const winHeight = window.innerHeight;

        this.$el.querySelector(".right-content").style["height"] =
          winHeight - topHeight + "px";
      });
    }
  },
  beforeDestroy() {
    window.onresize = null;
  }
};
</script>

<style scope>
.right-title {
}

.right-title .top {
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.right-title .user {
  display: flex;
  align-items: center;
}

.right-title .user .user-img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.bottom {
  padding: 20px 0;
  padding-left: 20px;
  border-bottom: 1px solid #eee;
  -moz-box-shadow: 0px 1px 2px #eeeeee;
  -webkit-box-shadow: 0px 1px 2px #eeeeee;
  box-shadow: 0px 1px 2px #eeeeee;
}

.right-content {
  padding: 20px;
  background: rgba(240, 242, 245, 1);
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
