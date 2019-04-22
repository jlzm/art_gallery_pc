<template>
  <div class="details">
    <div class="detail-content">
      <div class="ctn basis-info">
        <div class="title">
          基本信息
        </div>
        <div class="detail-inline">
          <div class="info-ctn">
            <div class="info">
              <div class="inline-label">
                姓名:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.sname"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.sname}}</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                性别:
              </div>
              <div>
                <el-select v-model="detail.sex" placeholder="请选择" v-if="editable"
                           size="small">
                  <el-option
                    label="男"
                    value="1">
                  </el-option>
                  <el-option
                    label="女"
                    value="2">
                  </el-option>
                </el-select>
                <span v-else>{{parseInt(detail.sex) === 1 ? '男' : '女'}}</span>
              </div>
            </div>
          </div>
          <div class="info-ctn">
            <div class="info">
              <div class="inline-label">
                生日:
              </div>
              <div>
                <el-date-picker
                v-if="editable"
                v-model="detail.birthday"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
          </el-date-picker>
                <span v-else>{{detail.birthday}}</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                家长姓名:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.parent"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.parent}}</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                联系电话:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.sphone"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.sphone}}</span>
              </div>
            </div>
          </div>
          <div class="info-ctn">

            <div class="info">
              <div class="inline-label">
                联系地址:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.home_address"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.home_address}}</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                就读学校:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.school"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.school}}</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                就读培训班:
              </div>
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="detail.train_class"
                  size="small"
                  v-if="editable">
                </el-input>
                <span v-else>{{detail.train_class}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ctn">
        <div class="title">
          报名信息
        </div>
        <div class="detail-inline">
          <div class="info-ctn">
            <div class="info">
              <div class="inline-label">
                所属班级:
              </div>
              <div>
                <el-select v-model="detail.clasz" placeholder="请选择" size="small" :disabled="!editable">
                  <el-option
                    v-for="item in claszOption"
                    :key="item.clid"
                    :value="item.clid"
                    :label="item.clname">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div v-if="editable" class="info">
              <div lass="inline-label">
                增减课时：
              </div>
              <div>
                <el-input-number
                  placeholder="请输入内容"
                  v-model="detail.addPeriod"
                  size="small"
                  :min="-detail.period_surplus"
                  >
                </el-input-number>
              </div>
            </div>
            <div class="info">
              <div lass="inline-label">
                已买课时：
              </div>
              <div>
                <el-input-number
                  disabled
                  placeholder="请输入内容"
                  v-model="detail.period_total"
                  size="small"
                  v-if="editable"
                  :min="0">
                </el-input-number>
                <span v-else>{{detail.period_total}}  节</span>
              </div>
            </div>
            <div class="info">
              <div class="inline-label">
                剩余课时:
              </div>
              <div>
                <el-input-number
                  disabled
                  placeholder="请输入内容"
                  v-model="detail.period_surplus"
                  :min="0"
                  :max="detail.period_total"
                  size="small"
                  v-if="editable">
                </el-input-number>
                <span v-else>{{detail.period_surplus}}  节</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ctn">
        <div class="title">
          上课信息
        </div>
        <el-form v-if="tableData.length" :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-edit" size="small" class="sys-corlor" @click="exportExcel()">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="tables">
          <tables
            :tableOption="tableOption"
            :tableData="tableData"
            :backData='tableData'
            @pageChange="pageChange"
            :total="pageJSON.total"
            pageType='back'></tables>
        </div>
      </div>
    </div>
    <div class="buttons">
      <div class="edit" v-if="!isEditing">
        <el-form :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-edit" size="small" class="sys-corlor" @click="edit()">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="save" v-else>
        <el-form :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-document" size="small" class="sys-corlor" @click="save()">保存
            </el-button>
            <!-- <el-button type="primary" icon="el-icon-edit"  size="small" class="sys-corlor-plain" @click="cancel">取消</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../../mixins/tableMixin';

  export default {
    name: 'detail',
    mixins: [mixin],
    mounted() {
      this.initTable();
      this.claszOption = this.$store.state.classroom;
      this.getClass();
      this.getCourseRecordBystu();
      if (this.$route.query && this.$route.query.type && this.$route.query.type === 'edit') {
        this.edit();
      }
    },
    data() {
      return {
        claszOption: [],
        testaaa: 0,
        detail: {
          addPeriod: 0,
          sid: '',
          sname: '',
          sex: '',
          birthday: '',
          parent: '',
          sphone: '',
          home_address: '',
          school: '',
          clasz: '',
          period_total: 0,
          period_surplus: 0
        },
        editable: false,
        tableOption: {},
        tableData: [],
        // 是否正在保存
        isEditing: false,
        // 分页属性
        pageJSON: {
          currentPage: 1,
          pageSize: 10,
          total: 10
        },
      };
    },
    methods: {
      /**
       * 导出excel
       */
      exportExcel() {
        if(!this.tableData.length) return;
      //   let json = {
      //   sname: this.detail.sname,
      //   clasz: this.detail.clasz,
      //   sex: this.detail.sex
      // };
        let json = {
        sid: this.detail.sid,
       
      };

        this.$axios
        .get("/getCourseExcel", {
          params: json
        })
        .then(res => {
          console.log("res", res);
          // console.log('res', res.request.responseURL);
          /**
           * 脱了裤子放屁.。。.
           */
          window.open(res.request.responseURL);
        });
      },

      initTable() {
        this.tableOption = {
          isMutiple: false,
          showOpr: false,
          showIndex: true,

          column: [
            {
              prop: 'cdate',
              label: '日期'
            },
            {
              prop: 'times',
              label: '上课时间',
              formatter(row) {
                return row.begintime + ' ~ ' + row.endtime;
              }
            },
            {
              prop: 'cname',
              label: '课程名称'
            },
            {
              prop: 'tname',
              label: '主教老师'
            },
            {
              prop: 'atname',
              label: '助教老师'
            },
            {
              prop: 'room',
              label: '上课教室'
            },
            {
              prop: 'ctype',
              label: '课程类型',
              formatter(row) {
                return parseInt(row.ctype) === 1 ? '普通课程' : '活动课程';
              }
            },
                        {
              prop: 'signtname',
              label: '签到老师'
            },
            {
              prop: 'signtime',
              label: '签到时间',
              formatter(row) {
                return row.signtime ? row.signtime.slice(0, -5) : '尚未签到';
              }
            },
            {
              prop: 'period_need',
              label: '消耗课时'
            },
          ]
        };
        this.getCourseRecordBystu();
      },

      // 表格分页
      pageChange(val) {
        this.pageJSON = val;
        this.getCourseRecordBystu();
      },

      // 修改与保存
      edit() {
        this.isEditing = true;
        this.editable = true;
        // 保存一次副本
        this.copy = JSON.parse(JSON.stringify(this.detail));
      },

      save() {
        this.isEditing = false;
        this.editable = false;
        this.updateStudent();
      },

      cancel() {
        this.isEditing = false;
        this.editable = false;
        this.detail = JSON.parse(JSON.stringify(this.copy));
      },

      /** API */
      // 查看学生详情
      getStudentDetail() {
        this.$axios.post('/getOneStudent', {sid: this.$route.params.id})
          .then((res) => {
            console.log('sres', res);
            if (res && res.data) {
              this.detail = res.data;
            }
            this.$set(this.detail, 'addPeriod', 0)
              // this.detail.addPeriod = 0;
          });
      },

      // 更新学生信息
      updateStudent() {
        this.detail.period_total += this.detail.addPeriod;
        this.detail.period_surplus += this.detail.addPeriod;
        this.$axios.post('/updateStudent', this.detail)
          .then((res) => {
            console.log('res', res.data);
            switch (res.data.code) {
              case 1:
                this.$message.success(res.data.msg);
                break;
            
              default:
              this.$message.error(res.data.msg);
                break;
            }
            this.getStudentDetail();
          });
      },

      // 获取班级信息
      getClass() {
        this.$axios.post('/getClass')
          .then((res) => {
            if (res && res.data && res.data.length) {
              this.claszOption = res.data;
              this.getStudentDetail();
            }
          });
      },

      // 根据学生id查上课记录
      getCourseRecordBystu() {
        this.tableData = [];
        this.$axios.post('/getCourseRecordBystu', {
          sid: this.$route.params.id,
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize
        })
          .then(res => {
            console.log('res', res.data);
            if (res.data && res.data.total > 0) {
              this.tableData = res.data.rows;
              this.pageJSON = {
                currentPage: res.data.crrentPage,
                pageSize: res.data.pageSize,
                total: res.data.total
              };
            }
          });
      }
    },
    watch: {
      $route: {
        deep: true,
        handler(val) {
        },
        immediate: true
      }
    }
  };
</script>

<style scope>
  .details {
    position: relative;
  }

  .detail-content {
    padding: 15px;
    background: #fff;
    padding-top: 0;
  }

  .detail-content .title {
    font-weight: bold;
    margin: 15px 0 15px 0;
  }

  .detail-content .detail-inline {
    margin-top: 15px;
    /* display: flex; */
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 35px;
    padding: 0 12px 20px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }

  .detail-content .detail-inline .info-ctn {
    display: flex;
  }

  .detail-content .detail-inline .info {
    display: flex;
    align-items: center;
    width: 33.3%;
  }

  .detail-content .detail-inline .inline-label {
    margin-right: 15px;
    width: 75px;
  }

  .detail-content .basis-info /deep/ .el-select input {
    width: 200px;
  }

  .detail-content .ctn {
    padding-top: 15px;
  }

  .detail-content .ctn .tables {
    margin-top: 10px;
  }

  .details .buttons {
    position: absolute;
    top: 15px;
    right: 15px;
  }


</style>
