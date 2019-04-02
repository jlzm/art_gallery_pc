<template>
  <div class="records">
    <div class="search">
      <el-form :inline="true" :model="recordForm" class="form-inline" ref="">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="recordForm.date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="课程名称">
          <el-input v-model="recordForm.cname" placeholder="课程名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上课老师" prop="teacher">
          <el-select
            v-model="recordForm.tid"
            filterable
            placeholder="请选择上课老师"
            size="small"
            clearable
          >
            <el-option
              v-for="item in recordForm.teacherOption"
              :key="item.value"
              :label="item.tname"
              :value="item.tid ">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-form-item label="上课学员" prop="treeValue">
            <treeselect
              placeholder="请选择上课学员"
              v-model="recordForm.sid"
              :options="recordForm.studentOption"
              :disable-branch-nodes="true"
              noOptionsText="没有相关成员"
              :value-consists-of="'LEAF_PRIORITY'"
              size="small"/>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item class="oprator">
          <el-button class="delete-btn" type="danger" icon="el-icon-delete" size="small" @click="deleteAll()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <tables :tableOption='tableOption'
            :backData='tableData'
            :tableData='tableData'
            @pageChange="pageChange"
            @handleSelectionChange='selectChange'
            :total="total"
            pageType='back'
    ></tables>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect';
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import mixin from '../../mixins/tableMixin';

  export default {
    name: 'records',
    mixins: [mixin],
    components: {
      Treeselect
    },
    mounted() {
      this.initTable();
      this.getStudentByCstep();
      this.getTeacherData();
    },
    data() {
      return {
        // 学生表
        recordForm: {
          // 学生姓名
          date: '',
          classes: '',
          cname: '',
          tname: '',
          classesOptions: [
            {
              value: '1',
              label: '班级1'
            },
            {
              value: '2',
              label: '班级2'
            }
          ],
          teacherOption: [],

          sid: null,
          studentOption: []
        },
        // 分页属性
        pageJSON: {
          currentPage: 1,
          pageSize: 10
        },
        tableOption: {},
        tableData: [],
        deleteStr: '', // 批量删除的ids
        total: 10 // 后台分页总条数
      };
    },
    methods: {
      initTable() {
        this.tableOption = {
          isMutiple: true,
          showOpr: true,
          column: [
            {
              prop: 'crid',
              label: 'crid',
              hidden: 'hidden'
            },
            {
              prop: 'cname',
              label: '课程名称'
            },
            {
              prop: 'cdate',
              label: '上课日期'
            },
            {
              prop: 'weeknum',
              label: '星期'
            },
            {
              prop: 'time',
              label: '时间段',
              formatter(row) {
                return row.begintime + ' - ' + row.endtime;
              }
            },
            {
              prop: 'tname',
              label: '上课老师'
            },
            {
              prop: 'room',
              label: '上课教室'
            },

            {
              prop: 'allarrive',
              label: '应到人数'
            },
            {
              prop: 'realarrive',
              label: '签到人数'
            },
            {
              prop: 'status',
              label: '课程状态',
              formatter(row) {
                return parseInt(row.status) === 0 ? '未开始' : '已结束';
              }
            }
          ],
          showDetailBtn: true,
          // 查看详情事件
          showDetail: (scope) => {
            const id = scope.row.crid;
            this.$router.push({
              path: '/home/recordsDetail/' + id
            });
          }
        };
        this.getData();
      },
      // 表格分页
      pageChange(val) {
        this.pageJSON = val;
        this.getData();
      },

      // 批量删除
      selectChange(val) {
        this.deleteStr = '';
        if (val && val.length) {
          val.forEach((item) => {
            this.deleteStr += `${item.crid},`;
          });
          if(val.length > 0) {
            this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
          }
        }
        console.log(this.deleteStr);
      },
      // 批量删除确认
      deleteAll() {
        if (!this.deleteStr) {
          this.$message.info('请至少选择一项');
        } else {
          this.$confirm('此操作将删除该批次课程, 是否确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteActive(this.deleteStr);
            });
        }
      },

      /**搜索 */
      searchData() {
        let json = {
          page: 1,
          rows: 10,
        };

        this.getData(json);
      },
      /** API */
      getData() {

        let json = Object.assign({}, {
          ctype: 1,
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          cname: this.recordForm.cname,
          clasz: this.recordForm.classes,
          tid: this.recordForm.tid,
          sid: this.recordForm.sid
        });
        if (this.recordForm.date) {
          json.begindate = this.recordForm.date[0];
          json.enddate = this.recordForm.date[1];
        } else {
          json.begindate = '';
          json.enddate = '';
        }
        this.tableData = [];
        this.$axios.post('/getCourseByPage', json)
          .then((res) => {
            if (res && res.data && res.data.total > 0) {
              this.tableData = res.data.rows;
              this.total = res.data.total;
              this.pageJSON.crrentPage = res.data.crrentPage;
              this.pageJSON.pageSize = res.data.pageSize;
            }
          });
      },

      
      deleteActive(id) { // 删除
        this.$axios.post('/deleteCourseRecord', {
          crid: id
        })
          .then((res) => {
            if (res && parseInt(res.data.code) === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData(status, 1);
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      // 获取老师
      getTeacherData() {
        this.teacherOption = [];
        this.$axios.post('/getTeacherSelectVul')
          .then((res) => {
            if (res && res.data.length) {
              this.recordForm.teacherOption = res.data;
            }
          });
      },
      getStudentByCstep() { // 学生下拉框
        this.$axios.post('/getStudentByClasz')
          .then((res) => {
            if (res && res.data) {
              let arr = [];
              for (let key in res.data) {
                let item = res.data[key];
                for (let i = 0; i < item.length; i++) {
                  item[i].id = item[i].sid;
                  item[i].label = item[i].sname;
                }
                arr.push({
                  id: key,
                  label: key,
                  children: item
                });
              }
              this.recordForm.studentOption = arr;
            }
          });
      },
    },

  };
</script>

<style scope>
  .records {
    padding: 15px;
    background: #fff;
  }

  .records /deep/ .vue-treeselect {
    width: 240px;
  }

  .records /deep/ .vue-treeselect__multi-value {
    line-height: initial;
  }


  .records /deep/ .vue-treeselect {
    line-height: initial;
  }
</style>
