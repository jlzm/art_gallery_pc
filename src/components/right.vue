<template>
  <div class="right">
    <div class="right-title">
      <div class="top">
        <div class="icons">
          <!-- <img src="../assets/images/minus.png" alt=""> -->
        </div>
        <div class="user">
          <img src="../assets/images/avatar.png" alt="">
          <div class="name">admin</div>
        </div>
      </div>
      <!-- 面包屑 -->
      <div class="bottom" v-if="activeIndex !== '/home'">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in pathInfo.meta.breadList"
            :key="index" :to="item.path"
            v-if="!item.type || pathInfo.params.type === item.type">
            {{item.title}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import util from '../util/util';

  export default {
    name: 'rightContent',
    props: {
      activeIndex: {
        type: String
      },
      pathInfo: {
        default: Object
      }
    },
    mounted() {
      // 计算rightContent的实际高度
      window.onresize = () => {
        this.repaint();
      };
      window.addEventListener('resize', this.repaint);
      this.repaint();
    },
    methods: {
      repaint() {
        this.$nextTick(() => {
          const topHeight = parseInt(util.getStyle(this.$el.querySelector('.right-title'), 'height'));
          const winHeight = window.innerHeight;

          this.$el.querySelector('.right-content').style['height'] = winHeight - topHeight + 'px';
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

  .right-title .user img {
    width: 32px;
    height: 32px;
    margin-right: 5px;
  }

  .bottom {
    padding: 20px 0;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    -moz-box-shadow: 0px 1px 2px #EEEEEE;
    -webkit-box-shadow: 0px 1px 2px #EEEEEE;
    box-shadow: 0px 1px 2px #EEEEEE;
  }

  .right-content {
    padding: 20px;
    background: rgba(240, 242, 245, 1);
    box-sizing: border-box;
    overflow-y: auto;
  }
</style>
