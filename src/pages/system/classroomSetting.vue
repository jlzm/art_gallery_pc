<template>
  <div class="sys-class-room">
    <div class="title-ctn" @click="changeNav">
      <div class="title" :class="activeNav === 'setup' && 'active'" data-nav='setup'>
        教室设置
      </div>
      <div class="title" :class="activeNav === 'classroomArrange' && 'active'" data-nav='classroomArrange'>
        教室安排
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'classroomSetting',
    data() {
      return {
        activeNav: 'classroomArrange'
      };
    },
    methods: {
      changeNav(e) {
        var target = e.target || e.srcElement;
        if (target.dataset && target.dataset.nav) {
          this.activeNav = target.dataset.nav;
          if (this.activeNav === 'classroomArrange') {
            this.$router.push({
              path: 'classroomArrange'
            });
          } else {
            this.$router.push({
              path: 'setup'
            });
          }
        }
      }
    },
    watch: {
      '$route': {
        deep: true,
        handler(val) {
          this.activeNav = val.name;
        },
        immediate: true
      }
    }
  };
</script>

<style scope>
  .sys-class-room {
    padding: 15px;
    background-color: #fff;
  }

  .sys-class-room {
    padding: 15px;
    background-color: #fff;
  }

  .sys-class-room .title-ctn {
    border-bottom: 1px solid #ddd;
    display: flex;
  }

  .sys-class-room .title-ctn .title {
    padding: 20px;
    padding-top: 5px;
    cursor: pointer;
  }

  .sys-class-room .title.active {
    border-bottom: 2px solid rgba(74, 185, 194, 1);
    color: rgba(74, 185, 194, 1);
  }

  .sys-class-room .content .table-ctn {
    margin-top: 15px;
  }

  .sys-class-room .content {
    padding: 15px 0;
  }
</style>
