<template>
  <div class="opr-record">
    <div class="search">
      <el-form :inline="true" :model="accountForm" class="form-inline" ref="">
        <el-form-item label="账号">
          <el-input v-model="accountForm.account" placeholder="输入账号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="accountForm.name" placeholder="输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>
          <el-button type="primary" icon="el-icon-delete" size="small" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <tables :tableOption='tableOption' :tableData="tableData"></tables>
    </div>
  </div>
</template>

<script>
  import mixin from '../../mixins/tableMixin';

  export default {
    name: 'oprRecord',
    mixins: [mixin],
    mounted() {
      this.initTable();
      this.tableData = [{
        oprAccount: 123456,
        oprName: '李老师',
        ip: '127.0.0.1',
        module: '系统设置/操作记录',
        oprTime: '2018-01-01'
      }];
    },
    data() {
      return {
        tableOption: {},
        tableData: [],
        dialogTitle: '新建账号',
        accountFormVisible: false,
        accountForm: {
          account: '',
          name: '',
          password: '123456'
        }
      };
    },
    methods: {
      initTable() {
        this.tableOption = {
          isMutiple: false,
          showIndex: true,
          column: [
            {
              prop: 'oprAccount',
              label: '操作账号'
            },
            {
              prop: 'oprName',
              label: '操作姓名'
            },
            {
              prop: 'ip',
              label: '操作ip'
            },
            {
              prop: 'module',
              label: '操作模块'
            },
            {
              prop: 'oprTime',
              label: '操作时间'
            }
          ]
        };
      }
    }
  };
</script>

<style scope>
  .opr-record {
    background-color: #fff;
    padding: 15px;
  }
</style>
