<template>
  <div>
    <div class="personal-content">
      <div class="search">
        <!-- 老师查询表格 -->
        <el-form :inline="true" :model="teacherForm" class="form-inline" ref>
          <el-form-item label="老师姓名">
            <el-input v-model="teacherForm.teacherName" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getTeacherData()"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="newItem()">新建</el-button>
            <el-button
              v-if="type==='students' && tableData.length"
              type="primary"
              icon="el-icon-document"
              size="small"
              @click="exportExcel()"
            >导出</el-button>
            <el-button
              class="delete-btn"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteAll()"
            >批量删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <tables
        :tableOption="tableOption"
        :backData="tableData"
        :total="total"
        :tableData="tableData"
        @pageChange="pageChange"
        pageType="back"
        @handleSelectionChange="selectChange"
        :loading="loading"
      ></tables>
    </div>
    <div class="dialogs">
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
          label-position="left"
          label-width="80px"
          :rules="teacherRule"
        >
          <el-form-item label="姓名" prop="teacherName">
            <el-input v-model="newTeacherForm.teacherName" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色" prop="trole">
            <el-select v-model="newTeacherForm.trole" placeholder="请选择" size="small">
              <el-option value="0" label="主教"></el-option>
              <el-option value="1" label="助教"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="性别" prop="gender">
            <el-select v-model="newTeacherForm.gender" placeholder="请选择" size="small">
              <el-option value="1" label="男"></el-option>
              <el-option value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="teacherAge">
            <el-input-number v-model="newTeacherForm.teacherAge" :max="90" :min="10"></el-input-number>
          </el-form-item>
          <el-form-item label="学历" prop="willingTime">
            <el-select
              v-model="newTeacherForm.educationalBackground"
              placeholder="请选择"
              size="small"
            >
              <el-option value="1" label="高中"></el-option>
              <el-option value="2" label="大专"></el-option>
              <el-option value="3" label="本科"></el-option>
              <el-option value="4" label="研究生"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话" prop="teacherTel">
            <el-input v-model="newTeacherForm.teacherTel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="销课量" prop="sale_total" v-show="oprType === 'show'">
            <el-input-number v-model="newTeacherForm.sale_total" :min="0" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="上课数" prop="course_total" v-show="oprType === 'show'">
            <el-input-number v-model="newTeacherForm.course_total" :min="0" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="newTeacherForm.address" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('newTeacherForm')">取 消</el-button>
          <el-button type="primary" @click="editTeacher()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
import util from "@/util/util";

export default {
  name: "teacher",
  mixins: [mixin],
  mounted() {
    // 只有没有id的时候才需要初始化
    this.getClass();
    if (!this.$route.params.id) {
      this.type = this.$route.params.type;
      this.initOpt(this.$route.params.type || "students");
    } else {
      this.tableData = [];
      this.tableOption = {};
      this.initOpt("teachers");
    }
  },
  data() {
    const telValidate = (rule, value, callback) => {
      if (
        !/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    };
    return {
      // 学生表
      studentForm: {
        // 学生姓名
        studentName: "",
        classes: "",
        claszOption: [],
        sex: ""
      },

      newStudentForm: {
        claszOption: [],
      },
      teacherForm: {
        teacherName: ""
      },

      // 新建老师
      newTeacherForm: {
        educationalBackground: "",
        teacherName: "",
        teacherAge: "",
        gender: "",
        teacherTel: "",
        visible: false,
        address: "",
        title: "新增老师",
        id: "",
        sale_total: 0,
        course_total: 0,
        trole: ""
      },
      selectedId: [],
      tableData: [],
      // 用于多选框
      multipleSelection: [],
      tableOption: {},
      type: "",
      id: "",
      // 表格是否加载
      loading: false,
      // 用于判断当前操作状态
      oprType: "new",
      // 教师表格验证
      teacherRule: {
        teacherName: [
          {
            // trigger: 'blur',
            required: true,
            message: "老师姓名必填"
          }
        ],
        trole: [
          {
            // trigger: 'blur',
            required: true,
            message: "老师角色必填"
          }
        ],
        teacherTel: [
          {
            // trigger: 'blur',
            required: true,
            message: "老师联系电话必填"
          },
          {
            validator: telValidate
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

    studengtTest(row) {
      let statusTxt = "";
      switch (row) {
        case "1":
          statusTxt = "高中";
          break;
        case "2":
          statusTxt = "大专";
          break;
        case "3":
          statusTxt = "本科";
          break;
        case "4":
          statusTxt = "研究生";
          break;

        default:
          break;
      }
      return statusTxt;
    },

    initOpt(type) {
      this.tableData = [];

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
              prop: "tname",
              label: "姓名"
            },
            {
              prop: "tsex",
              label: "性别",
              formatter(value) {
                return parseInt(value.tsex) == 1 ? "男" : "女";
              }
            },
            {
              prop: "tage",
              label: "年龄"
            },
            {
              prop: "educationalbg",
              label: "学历",
              formatter: row => {
                return this.studengtTest(row.educationalbg);
              }
            },
            {
              prop: "tphone",
              label: "电话号码"
            },
            {
              prop: "nvitation_code",
              label: "邀请码"
            },
            {
              prop: "sale_total",
              label: "总销课量"
            },
            {
              prop: "course_total",
              label: "总上课节数"
            },
            {
              prop: "home_address",
              label: "联系地址",
              hidden: "hidden"
            }
          ],
          // 查看详情事件
          showDetail: scope => {
            this.newTeacherForm = {
              title: "详情",
              visible: true,
              teacherName: scope.row.tname,
              teacherAge: scope.row.tage,
              gender: scope.row.tsex + "",
              teacherTel: scope.row.tphone,
              address: scope.row.home_address,
              course_total: scope.row.course_total,
              sale_total: scope.row.sale_total,
              trole: scope.row.trole,
              disabled: true
            };
            this.oprType = "show";
          },
          editDetail: scope => {
            console.log('scope', scope);
            this.newTeacherForm = {
              title: "编辑详情",
              visible: true,
              trole: scope.row.trole,
              teacherName: scope.row.tname,
              teacherAge: scope.row.tage,
              gender: scope.row.tsex + "",
              teacherTel: scope.row.tphone,
              address: scope.row.home_address,
              course_total: scope.row.course_total,
              sale_total: scope.row.sale_total,
              id: scope.row.tid,
              disabled: false,
              educationalBackground: scope.row.educationalbg
            };
            this.oprType = "edit";
          },
          delete: scope => {
            this.$confirm("此操作将删除该教师, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.deleteTeacher(scope.row.tid);
            });
          }
        };
        this.getTeacherData();
    },

    // 打开新建弹窗
    newItem() {
      console.log(1);
        this.oprType = "new";
        if (this.$refs.newTeacherForm) {
          this.$refs.newTeacherForm.resetFields();
        }
        this.newTeacherForm = {
          teacherName: "",
          teacherAge: "",
          gender: "1",
          teacherTel: "",
          visible: true,
          address: "",
          title: "新增老师"
        };
      
    },

    resetNewStudents() {
      this.newStudentForm = {
        studentName: "",
        parentName: "",
        sex: 1,
        visible: true,
        tel: "",
        address: "",
        period_total: 0,
        school: "",
        willingTime: [],
        age: 1,
        train_class: "",
        clasz: ""
      };
    },

    // 多选表格
    selectChange(val) {
      this.selectedId = val.map(item => {
        if (this.type === "students") {
          return item.sid;
        } else {
          return item.tid;
        }
      });
    },
    
    // 批量删除
    deleteAll() {
      console.log("this.selectedId", this.selectedId);
 if (this.selectedId.length) {
        this.$confirm("此操作将删除教师, 是否确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteTeacher(this.selectedId.join(","));
          console.log("删除老师");
        });
      } else {
        this.$message("请至少选择一项");
      }
    },



    // 操作老师
    editTeacher() {
      this.$refs.newTeacherForm.validate(validate => {
        if (validate) {
          let json = {
            educationalbg: this.newTeacherForm.educationalBackground,
            tname: this.newTeacherForm.teacherName,
            tsex: this.newTeacherForm.gender,
            tage: this.newTeacherForm.teacherAge,
            tphone: this.newTeacherForm.teacherTel,
            home_address: this.newTeacherForm.address,
            // trole: this.newTeacherForm.trole
          };
          console.log("json", json);
          let url;
          switch (this.oprType) {
            case "new":
              url = "/insertOneTeacher";
              break;
            case "edit":
              url = "/updateOneTeacher";
              json.tid = this.newTeacherForm.id;
              break;
            case "show":
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
      if (this.type === "students") {
        this.getStudentData();
      } else {
        this.getTeacherData();
      }
    },

    /** API */
    // 新建老师api
    postTeacher(json, url) {
      this.$axios.post(url, json).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getTeacherData();
          this.newTeacherForm.visible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 获取班级信息
    getClass() {
      this.$axios.post("/getClass").then(res => {
        if (res && res.data && res.data.length) {
          this.studentForm.claszOption = res.data;
          this.newStudentForm.claszOption = res.data;
          this.$store.commit("saveClassRoom", res.data);
        }
      });
    },


    // 获取老师
    getTeacherData() {
      this.tableData = [];
      this.loading = true;
      let propsData = {
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          tname: this.teacherForm.teacherName
        }
      this.$axios
        .post("/getTeachersByPage", propsData)
        .then(res => {
          console.log('tres', res);
          this.loading = false;
          if (res && res.data.rows && res.data.rows.length) {
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        });
    },


    /** 删除老师 */
    deleteTeacher(id) {
      console.log("id", id);
      this.$axios.post("/deleteTeacher", { tid: id }).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
        this.getTeacherData();
      });
    }
  },
  watch: {
    $route: {
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
