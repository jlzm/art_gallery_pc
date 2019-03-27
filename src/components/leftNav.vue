<template>
  <div id="left" class="clearfix" ref="left">
    <div class="logo">
      <img src="../assets/images/logo.jpg" alt="">
      <span>HAPPY MOMA</span>
    </div>
    <el-row class="tac">
      <el-col>
        <el-menu
          :default-active="activeIndex"
          class="ulFa"
          background-color="#363845"
          text-color="#cfced3"
          active-text-color="#ffd04b"
          router>
          <!-- <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>人员管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">学员管理</el-menu-item>
              <el-menu-item index="1-2">老师管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>上课管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">上课记录</el-menu-item>
              <el-menu-item index="1-2">上课排班</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <template v-for="(item, index) in leftData">
            <el-menu-item :index="item.path" :key="index" v-if="!(item.childData && item.childData.length)">
              <i :class="item.icon"></i>
              <span slot="title" style="font-size:14px;">{{item.name}}</span>
            </el-menu-item>
            <el-submenu :index="item.path" :key="index" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <!-- <img :src="'@/assets/images/' +  item.icon + '.png'" alt=""> -->
                <span>{{item.name}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="child.path" v-for="(child, childIndex) in item.childData" :key="childIndex">{{child.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    
  },
  props: {
    leftData: {
      required: true,
      type: Array
    },
    activeIndex: {
      type: String
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
  }
  .logo img {
    width: 40px;
    height: 40px;
  }
  .logo span {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-left: 15px;
  }
  #left {
    overflow: hidden;
    height: 100%;
    background:#363845;
  }
  .el-menu-item-group /deep/ .el-menu-item-group__title{
      display:none;
    }
  .el-menu {
    border: none;
  }
  .ulFa{
    text-align:left;
  }
  .ulFa .el-menu-item{
    font-size:12px;
    min-width: auto;
    height: 44px;
    line-height: 44px;
    padding-left: 60px;
  }
  .ulFa .el-submenu.is-active .el-icon-ear {
    border-bottom-color: #409EFF;
    color: #409EFF;
  }
  .ulFa .el-submenu__title i {
    margin-right: 0;
  }
  /*打开的父元素*/
  /* .ulFa .is-opened /deep/ .el-submenu__title{
    font-weight: 800;
  } */
  .el-menu-item:focus, .el-menu-item:hover {
    background-color: #2E303C!important;
  }
  #left >>> .el-submenu__title:hover {
    background-color: #2E303C!important;
  }
  .el-menu-item.is-active {
    background-color: #2E303C!important;
    color: #409EFF;
  }
  #left >>> .el-submenu .el-submenu__title {
    height: 46px;
    line-height: 46px;
    background: #363845;
    color: #CFCED3;
  }
  #left >>> .el-submenu .el-menu-item {
    background: #363845;
    padding-left: 50px!important;
    color: #CFCED3;
  }
  .el-icon-personal{
    background: url('../assets/images/icon-personal.png') no-repeat center center;
    width:24px;
    height: 18px;
  }
  .el-icon-personal::before {
    content: "\E620";
    z-index: -1;
    width: 24px;
    opacity: 0;
  }
  .el-icon-class{
    background: url('../assets/images/icon-class.png') no-repeat center center;
    width:24px;
    height: 18px;
  }
  .el-icon-active{
    background: url('../assets/images/icon-active.png') no-repeat center center;
    width:24px;
    height: 18px;
  }
  .el-icon-record{
    background: url('../assets/images/icon-record.png') no-repeat center center;
    width:24px;
    height: 18px;
  }
  .el-icon-system{
    background: url('../assets/images/icon-system.png') no-repeat center center;
    width:24px;
    height: 18px;
  }

</style>
