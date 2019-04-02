<template>
  <div class="attence-record">
    <div class="search">
      <el-form :inline="true" :model="recordForm" class="form-inline" ref="">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="recordForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="老师姓名">
          <el-input v-model="recordForm.teacherName" placeholder="输入老师姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="班次">
          <el-select v-model="recordForm.classes" placeholder="请选择" size="small">
            <el-option
              v-for="item in recordForm.classesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签到类型">
          <el-select v-model="recordForm.signType" placeholder="请选择" size="small">
            <el-option
              v-for="item in recordForm.signOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤状态">
          <el-select v-model="recordForm.signState" placeholder="请选择" size="small">
            <el-option
              v-for="item in recordForm.stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>
          <el-button class="reset-btn" type="warning" icon="el-icon-delete" size="small">重置</el-button>
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
    name: 'attenceRecord',
    mixins: [mixin],
    mounted() {
      this.initTable();
    },
    data() {
      return {
        recordForm: {
          date: '',
          teacherName: '',
          classes: '',
          classesOptions: [{
            label: '小班',
            value: 0
          },
            {
              label: '中班',
              value: 1
            },
            {
              label: '大班',
              value: 2
            }],
          signType: '',
          signOptions: [{
            label: '未签到',
            value: 0
          },
            {
              label: '已签到',
              value: 1
            }],
          signState: '',
          stateOptions: [{
            label: '正常',
            value: 0
          },
            {
              label: '异常',
              value: 1
            }]
        },
        tableOption: {},
        tableData: []
      };
    },
    methods: {
      initTable() {
        this.tableOption = {
          showIndex: true,
          showOpr: false,
          showEditBtn: false,
          column: [
            {
              prop: 'teacherName',
              label: '姓名'
            },
            {
              prop: 'classOrder',
              label: '班次'
            },
            {
              prop: 'signTime',
              label: '签到时间'
            },
            {
              prop: 'signLocation',
              label: '签到地点'
            },
            {
              prop: 'signOutTime',
              label: '签退时间'
            },
            {
              prop: 'signOutLocation',
              label: '签退地点'
            },
            {
              prop: 'signState',
              label: '考勤状态'
            }
          ],
          // editDetail: (scope) => {
          //   console.log(scope);
          // }
        };
        this.tableData = [{
          teacherName: '王小虎',
          classOrder: '早班',
          signTime: '2018-11-12 09:00',
          signLocation: '麓谷企业广场',
          signOutTime: '2018-11-12 18:00',
          signOutLocation: '麓谷企业广场',
          signState: '正常'
        }];
      }
    }
  };
</script>

<style scope>
  .attence-record {
    padding: 15px;
    background-color: #fff;
  }
</style>
