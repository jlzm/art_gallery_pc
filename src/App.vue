<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.el-dialog /deep/ .el-dialog__footer .el-button--primary{
  background-color: rgba(74, 185, 194, 1);
  border-color: rgba(74, 185, 194, 1);
}
</style>
