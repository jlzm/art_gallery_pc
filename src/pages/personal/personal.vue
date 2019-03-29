<template>
  <div>
    <div class="personal-content">
      <div class="search">

        <!-- 学生查询表格 -->
        <el-form :inline="true" :model="studentForm" class="form-inline" ref="" v-if="type==='students'">
          <el-form-item label="学员姓名">
            <el-input v-model="studentForm.studentName" placeholder="输入学员姓名" size="small" clearable></el-input>
          </el-form-item>

          <el-form-item label="班级">
            <el-select
              v-model="studentForm.classes"
              placeholder="请选择"
              size="small"
              clearable>
              <el-option
                v-for="item in studentForm.claszOption"
                :key="item.clid"
                :label="item.clname"
                :value="item.clid">
              </el-option>
            </el-select>

          </el-form-item> <el-form-item label="性别">
            <el-select
              v-model="studentForm.sex"
              placeholder="请选择"
              size="small"
              clearable>
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="getStudentData">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- 老师查询表格 -->
        <el-form :inline="true" :model="teacherForm" class="form-inline" ref="" v-else>
          <el-form-item label="老师姓名">
            <el-input v-model="teacherForm.teacherName" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="getTeacherData">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="newItem">新建</el-button>
            <!--<el-button type="primary" icon="el-icon-document" size="small">导入</el-button>-->
            <el-button type="danger" icon="el-icon-delete" size="small" plain @click="deleteAll()">批量删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <tables
        :tableOption='tableOption'
        :backData='tableData'
        :total='total'
        :tableData="tableData"
        @pageChange="pageChange"
        pageType='back'
        @handleSelectionChange='selectChange'
        :loading="loading"></tables>
    </div>
    <div class="dialogs">
      <el-dialog
        :title="'新增学生'"
        :visible.sync="newStudentForm.visible"
        :close-on-click-modal="false"
        width="550px"
        top="5vh">
        <el-form
          :model="newStudentForm"
          class="form-inline"
          ref="newStudentForm"
          label-position="right"
          label-width="90px"
          :rules="newStudentRule">
          <el-form-item label="姓名" prop="studentName">
            <el-input v-model="newStudentForm.studentName" size="small"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-select v-model="newStudentForm.sex" placeholder="请选择" size="small">
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" required prop="age" size="small">
            <el-input-number v-model="newStudentForm.age" :min="1">

            </el-input-number>
          </el-form-item>
          <el-form-item label="购买课时" required prop="period_total">
            <el-input-number v-model="newStudentForm.period_total" :min="1" size="small">

            </el-input-number>
          </el-form-item>
          <el-form-item label="所属班级" prop="clasz">
            <el-select v-model="newStudentForm.clasz" placeholder="请选择" size="small">
              <el-option v-for="item in newStudentForm.claszOption" :key="item.clid" :value="item.clid"
                         :label="item.clname"></el-option>
            </el-select>
          </el-form-item>

          <!--<el-form-item label="意愿时间" prop="willingTime">-->
          <!--<el-select-->
          <!--v-model="newStudentForm.willingTime"-->
          <!--placeholder="请选择"-->
          <!--size="small"-->
          <!--multiple>-->
          <!--<el-option value="星期一" label="星期一"></el-option>-->
          <!--<el-option value="星期二" label="星期二"></el-option>-->
          <!--<el-option value="星期三" label="星期三"></el-option>-->
          <!--<el-option value="星期四" label="星期四"></el-option>-->
          <!--<el-option value="星期五" label="星期五"></el-option>-->
          <!--<el-option value="星期六" label="星期六"></el-option>-->
          <!--<el-option value="星期日" label="星期日"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item label="家长姓名" prop="parentName">
            <el-input v-model="newStudentForm.parentName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" required prop="tel">
            <el-input v-model="newStudentForm.tel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="newStudentForm.address" size="small"></el-input>
          </el-form-item>
          <el-form-item label="就读学校" prop="school">
            <el-input v-model="newStudentForm.school" size="small"></el-input>
          </el-form-item>
          <el-form-item label="就读培训班" prop="train_class">
            <el-input v-model="newStudentForm.train_class" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newStudentForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新建老师  -->
      <el-dialog
        :title="newTeacherForm.title"
        :visible.sync="newTeacherForm.visible"
        :close-on-click-modal="false"
        width="400px"
      >
        <el-form
          :disabled="newTeacherForm.disabled"
          :model="newTeacherForm"
          class="form-inline"
          ref="newTeacherForm"
          label-position='left'
          label-width="80px"
          :rules="teacherRule">
          <el-form-item label="姓名" prop="teacherName">
            <el-input v-model="newTeacherForm.teacherName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="newTeacherForm.gender" placeholder="请选择" size="small">
              <el-option value="1" label="男"></el-option>
              <el-option value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="teacherAge">
            <el-input-number v-model="newTeacherForm.teacherAge" :max="90" :min="10">
            </el-input-number>
          </el-form-item>

          <el-form-item label="学历" prop="willingTime">
            <el-select v-model="newTeacherForm.educationalBackground" placeholder="请选择" size="small">
              <el-option value="1" label="高中"></el-option>
              <el-option value="2" label="大专"></el-option>
              <el-option value="2" label="本科"></el-option>
              <el-option value="2" label="研究生"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话" prop="teacherTel">
            <el-input v-model="newTeacherForm.teacherTel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="销课量" prop="sale_total" v-show="oprType === 'show'">
            <el-input-number v-model="newTeacherForm.sale_total" :min=0 size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="上课数" prop="course_total" v-show="oprType === 'show'">
            <el-input-number v-model="newTeacherForm.course_total" :min=0 size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="newTeacherForm.address" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('newTeacherForm')">取 消</el-button>
          <el-button type="primary" @click="editTeacher">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import mixin from '../../mixins/tableMixin';
  import util from '@/util/util';

  export default {
    name: 'personal',
    mixins: [mixin],
    mounted() {
      // 只有没有id的时候才需要初始化
      this.getClass();
      if (!this.$route.params.id) {
        this.type = this.$route.params.type;
        this.initOpt(this.$route.params.type || 'students');
      } else {
        this.tableData = [];
        this.tableOption = {};
        this.initOpt('teachers');
      }
    },
    data() {
      const telValidate = (rule, value, callback) => {
        if (!/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(value)) {
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };
      return {
        // 学生表
        studentForm: {
          // 学生姓名
          studentName: '',
          classes: '',
          claszOption: [],
          sex: ''
        },
        teacherForm: {
          teacherName: ''
        },
        // 新建学生
        newStudentForm: {
          studentName: '',
          parentName: '',
          sex: 1,
          tel: '',
          visible: false,
          address: '',
          period_total: 0,
          school: '',
          willingTime: [],
          age: 1,
          train_class: '',
          clasz: '',
          claszOption: []
        },

        // 新建老师
        newTeacherForm: {
          educationalBackground: '',
          teacherName: '',
          teacherAge: '',
          gender: '',
          teacherTel: '',
          visible: false,
          address: '',
          title: '新增老师',
          id: '',
          sale_total: 0,
          course_total: 0
        },
        selectedId: [],
        tableData: [],
        // 用于多选框
        multipleSelection: [],
        tableOption: {},
        type: '',
        id: '',
        // 表格是否加载
        loading: false,
        // 用于判断当前操作状态
        oprType: 'new',
        // 教师表格验证
        teacherRule: {
          teacherName: [
            {
              // trigger: 'blur',
              required: true,
              message: '老师姓名必填'
            }
          ],
          teacherTel: [
            {
              // trigger: 'blur',
              required: true,
              message: '老师联系电话必填'
            },
            {
              validator: telValidate,

            }
          ]
        },
        // 学生表格验证
        newStudentRule: {
          studentName: [
            {
              trigger: 'blur',
              required: true,
              message: '学生姓名必填'
            }
          ],
          parentName: [
            {
              trigger: 'blur',
              required: true,
              message: '家长姓名必填'
            }
          ],
          sex: [
            {
              trigger: 'blur',
              required: true,
              message: '学生性别必选'
            }
          ],
          tel: [
            {
              trigger: 'blur',
              validator: telValidate
            }
          ],
          willingTime: [
            {
              trigger: 'blur',
              required: true,
              message: '意愿时间必选'
            }
          ],
          clasz: [
            {
              trigger: 'blur',
              required: true,
              message: '报名班级必选'
            }
          ]
        },
        // 分页属性
        pageJSON: {
          currentPage: 1,
          pageSize: 10
        },
        total: 10
      };
    },
    methods: {
      initOpt(type) {
        this.tableData = [];
        if (type === 'students') {
          this.tableOption = {
            isMutiple: true,
            showOpr: true,
            showDetailBtn: true,
            showDelBtn: true,
            showEditBtn: true,
            column: [
              // {
              //   prop: 'sid',
              //   label: 'id'
              // },
              {
                prop: 'sname',
                label: '姓名'
              },
              {
                prop: 'sex',
                label: '性别',
                formatter: (row) => {
                  return parseInt(row.sex) === 1 ? '男生' : '女生';
                }
              },
              {
                prop: 'clasz',
                label: '所属班级',
                formatter: (row) => {
                  return util.getArrVal(this.studentForm.claszOption, 'clid', 'clname', row.clasz);
                }
              },
              {
                prop: 'period_total',
                label: '已买课时',
                formatter: (row) => {
                  return row.period_total + '';
                }
              },
              {
                prop: 'period_surplus',
                label: '剩余课时'
              },
              {
                prop: 'parent',
                label: '家长姓名'
              },
              {
                prop: 'sphone',
                label: '联系电话'
              }
            ],
            // 查看详情事件
            showDetail: (scope) => {
              const id = scope.row.sid;
              this.$router.push({
                path: '/home/detail/students/' + id + '?type=view'
              });
            },

            editDetail: (scope) => {
              const id = scope.row.sid;
              this.$router.push({
                path: '/home/detail/students/' + id + '?type=edit'
              });
            },

            delete: (scope) => {
              const id = scope.row.sid;
              this.deleteStudent(id);
            }
          };
          this.getStudentData();
        } else if (type === 'teachers') {
          this.tableOption = {
            isMutiple: true,
            showOpr: true,
            showDetailBtn: true,
            showDelBtn: true,
            showEditBtn: true,
            column: [
              // {
              //   prop: 'tid',
              //   label: 'id'
              // },
              {
                prop: 'tname',
                label: '姓名'
              },
              {
                prop: 'tsex',
                label: '性别',
                formatter(value) {
                  return parseInt(value.tsex) === 1 ? '男性' : '女性';
                }
              },
              {
                prop: 'tage',
                label: '年龄'
              },
              {
                prop: 'education_background',
                label: '学历'
              },
              {
                prop: 'tphone',
                label: '电话号码'
              },
              {
                prop: 'sale_total',
                label: '总销课量'
              },
              {
                prop: 'course_total',
                label: '总上课节数'
              },
              {
                prop: 'home_address',
                label: '联系地址',
                hidden: 'hidden'
              }
            ],
            // 查看详情事件
            showDetail: (scope) => {
              this.newTeacherForm = {
                title: '详情',
                visible: true,
                teacherName: scope.row.tname,
                teacherAge: scope.row.tage,
                gender: scope.row.tsex + '',
                teacherTel: scope.row.tphone,
                address: scope.row.home_address,
                course_total: scope.row.course_total,
                sale_total: scope.row.sale_total,
                disabled: true
              };
              this.oprType = 'show';
            },
            editDetail: (scope) => {
              this.newTeacherForm = {
                title: '编辑详情',
                visible: true,
                teacherName: scope.row.tname,
                teacherAge: scope.row.tage,
                gender: scope.row.tsex + '',
                teacherTel: scope.row.tphone,
                address: scope.row.home_address,
                course_total: scope.row.course_total,
                sale_total: scope.row.sale_total,
                id: scope.row.tid,
                disabled: false
              };
              this.oprType = 'edit';
            },
            delete: (scope) => {
              this.deleteTeacher(scope.row.tid);
            }
          };
          this.getTeacherData();

        } else {
          this.tableData = [];
          this.tableOption = {};
        }
      },
      newItem() {
        if (this.type === 'students') {
          this.newStudentForm.visible = true;
          this.getClass();
        } else {
          this.oprType = 'new';
          if (this.$refs.newTeacherForm) {
            this.$refs.newTeacherForm.resetFields();
          }
          this.newTeacherForm = {
            teacherName: '',
            teacherAge: '',
            gender: '1',
            teacherTel: '',
            visible: true,
            address: '',
            title: '新增老师'
          };
        }
      },
      // 多选表格
      selectChange(val) {
        this.selectedId = val.map((item) => {
          if (this.type === 'students') {
            return item.sid;
          } else {
            return item.tid;
          }
        });
      },
      // 批量删除
      deleteAll() {
        if (this.selectedId.length && this.type === 'students') {
          console.log(1);
          this.deleteStudent(this.selectedId.join(','));
        } else {
          this.$message('请至少选择一项');
          console.log(2);
        }
      },
      // 学生dialog确认
      confirm() {
        this.$refs.newStudentForm.validate((validate) => {
          if (validate) {
            this.newStudent();
          }
        });
      },
      // 操作老师
      editTeacher() {
        this.$refs.newTeacherForm.validate((validate) => {
          if (validate) {
            let json = {
              tname: this.newTeacherForm.teacherName,
              tsex: this.newTeacherForm.gender,
              tage: this.newTeacherForm.teacherAge,
              tphone: this.newTeacherForm.teacherTel,
              home_address: this.newTeacherForm.address,
            };
            let url;
            switch (this.oprType) {
              case 'new':
                url = '/insertOneTeacher';
                break;
              case 'edit':
                url = '/updateOneTeacher';
                json.tid = this.newTeacherForm.id;
                break;
              case 'show':
              default:
                this.newTeacherForm.visible = false;
            }
            this.postTeacher(json, url);
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this[formName].visible = false;
      },
      // 后台分页事件监听
      pageChange(val) {
        this.pageJSON = val;
        if (this.type === 'students') {
          this.getStudentData();
        } else {
          this.getTeacherData();
        }
      },
      /** API */
      // 新建老师api
      postTeacher(json, url) {
        this.newTeacherForm.visible = false;
        this.$axios.post(url, json)
          .then((res) => {
            if (res && parseInt(res.data.code) === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getTeacherData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      // 获取班级信息
      getClass() {
        this.$axios.post('/getClass')
          .then((res) => {
            if (res && res.data && res.data.length) {
              this.studentForm.claszOption = res.data;
              this.newStudentForm.claszOption = res.data;
              this.$store.commit('saveClassRoom', res.data);
            }
          });
      },
      // 获取学生
      getStudentData() {
        // this.tableData = []
        this.loading = true;
        this.$axios.post('/getStudentsByPage', {
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          sname: this.studentForm.studentName,
          clasz: this.studentForm.classes
        })
          .then((res) => {
            this.loading = false;
            this.total = res.data.total;
            if (res && res.data.rows && res.data.rows.length) {
              this.tableData = res.data.rows;
            }
          });
      },
      // 获取老师
      getTeacherData() {
        this.tableData = [];
        this.loading = true;
        this.$axios.post('/getTeachersByPage', {
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          tname: this.teacherForm.teacherName
        })
          .then((res) => {
            this.loading = false;
            if (res && res.data.rows && res.data.rows.length) {
              this.tableData = res.data.rows;
            }
          });
      },
      // 新建学生
      newStudent() {
        let json = {
          sname: this.newStudentForm.studentName,
          sex: this.newStudentForm.sex,
          age: this.newStudentForm.age,
          period_total: this.newStudentForm.period_total,
          period_surplus: this.newStudentForm.period_total,
          parent: this.newStudentForm.parentName,
          sphone: this.newStudentForm.tel,
          school: this.newStudentForm.school,
          home_address: this.newStudentForm.address,
          studytime: this.newStudentForm.willingTime.join(','),
          train_class: this.newStudentForm.train_class,
          clasz: this.newStudentForm.clasz,
        };
        this.$axios.post('/insertOneStudent', json)
          .then((res) => {
            this.$refs.newStudentForm.resetFields();
            this.newStudentForm.visible = false;
            if (res && res.data) {
              if (parseInt(res.data.code) === 1) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
                this.getStudentData();
              } else {
                this.$message.error(res.data.msg);
              }
            }
          });
      },
      // 删除学生
      deleteStudent(id) {
        this.$axios.post('/deleteStudent', {sid: id})
          .then((res) => {
            if (res && parseInt(res.data.code) === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getStudentData();
          });
      },

      /** 删除老师 */
      deleteTeacher(id) {
        this.$axios.post('/deleteTeacher', {tid: id})
          .then((res) => {
            if (res && parseInt(res.data.code) === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getTeacherData();
          });
      }
    },
    computed: {},
    components: {},
    watch: {
      '$route': {
        deep: true,
        handler(route) {
          this.type = route.params.type;
          this.id = route.params.id;
        },
        immediate: true
      },
      type(newVal) {
        if (!this.id) {
          this.pageJSON = {
            currentPage: 1,
            pageSize: 10
          };
          this.total = 10;
          this.initOpt(newVal);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .personal-content {
    padding: 15px;
    background: #fff;
  }

  .dialogs {
    /deep/ .el-dialog {
      .el-select {
        width: 100%;
      }

      .el-input-number {
        width: 100%;
      }
    }
  }
</style>
