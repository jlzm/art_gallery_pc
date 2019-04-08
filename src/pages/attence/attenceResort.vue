<template>
  <div class="resort">
    <div class="title-ctn" @click="changeNav">
      <div class="title" :class="activeNav === 'resorthome' && 'active'" data-nav='resorthome'>
        排班设置
      </div>
      <div class="title" :class="activeNav === 'classsetting' && 'active'" data-nav='classsetting'>
        班次设置
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'resort',
    data() {
      return {
        activeNav: 'resorthome'
      };
    },
    methods: {
      changeNav(e) {
        var target = e.target || e.srcElement;
        if (target.dataset && target.dataset.nav) {
          this.activeNav = target.dataset.nav;
          if (this.activeNav === 'resorthome') {
            this.$router.push({
              path: 'resorthome'
            });
          } else {
            this.$router.push({
              path: 'classSetting'
            });
          }
        }
      }
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        handler(route) {
          this.activeNav = route.name.toLowerCase();
        }
      }
    }
  };
</script>

<style scope>
  .resort {
    padding: 15px;
    background-color: #fff;
  }

  .resort {
    padding: 15px;
    background-color: #fff;
  }

  .resort .title-ctn {
    border-bottom: 1px solid #ddd;
    display: flex;
  }

  .resort .title-ctn .title {
    padding: 20px;
    padding-top: 5px;
    cursor: pointer;
  }

  .resort .title.active {
    border-bottom: 2px solid rgba(74, 185, 194, 1);
    color: rgba(74, 185, 194, 1);
  }

  .resort .content .table-ctn {
    margin-top: 15px;
  }

  .resort .content {
    padding: 15px 0;
  }
</style>
