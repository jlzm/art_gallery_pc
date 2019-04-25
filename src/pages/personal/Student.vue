<template>
  <div>
    <div class="personal-content">
      <div class="search">
        <!-- 学生查询表格 -->
        <el-form
          :inline="true"
          :model="studentForm"
          class="form-inline"
          ref
        >
          <el-form-item label="学员姓名">
            <el-input v-model="studentForm.studentName" placeholder="输入学员姓名" size="small" clearable></el-input>
          </el-form-item>

          <el-form-item label="班级">
            <el-select v-model="studentForm.classes" placeholder="请选择" size="small" clearable>
              <el-option
                v-for="item in studentForm.claszOption"
                :key="item.clid"
                :label="item.clname"
                :value="item.clid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="studentForm.sex" placeholder="请选择" size="small" clearable>
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getStudentData()"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item class="oprator">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="newItem()">新建</el-button>
            <el-button
              v-if="tableData.length"
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
      <el-dialog
        :title="'新增学生'"
        :visible.sync="newStudentForm.visible"
        :close-on-click-modal="false"
        width="550px"
        top="5vh"
      >
        <el-form
          :model="newStudentForm"
          class="form-inline"
          ref="newStudentForm"
          label-position="right"
          label-width="90px"
          :rules="newStudentRule"
        >
          <el-form-item label="姓名" prop="studentName">
            <el-input v-model="newStudentForm.studentName" size="small"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-select v-model="newStudentForm.sex" placeholder="请选择" size="small">
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" required prop="birthday" size="small">
            <el-date-picker
              v-model="newStudentForm.birthday"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="购买课时" required prop="period_total">
            <el-input-number v-model="newStudentForm.period_total" :min="1" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="所属班级" prop="clasz">
            <el-select v-model="newStudentForm.clasz" placeholder="请选择" size="small">
              <el-option
                v-for="item in newStudentForm.claszOption"
                :key="item.clid"
                :value="item.clid"
                :label="item.clname"
              ></el-option>
            </el-select>
          </el-form-item>

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
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
import util from "@/util/util";

export default {
  name: "student",
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

      // 新建学生
      newStudentForm: {
        studentName: "",
        parentName: "",
        sex: 1,
        tel: "",
        visible: false,
        address: "",
        period_total: 0,
        school: "",
        willingTime: [],
        birthday: "",
        train_class: "",
        clasz: "",
        claszOption: []
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

      // 学生表格验证
      newStudentRule: {
        studentName: [
          {
            trigger: "blur",
            required: true,
            message: "学生姓名必填"
          }
        ],
        parentName: [
          {
            trigger: "blur",
            required: true,
            message: "家长姓名必填"
          }
        ],
        birthday: [
          {
            trigger: "blur",
            required: true,
            message: "学生生日必填"
          }
        ],
        sex: [
          {
            trigger: "blur",
            required: true,
            message: "学生性别必选"
          }
        ],
        tel: [
          {
            trigger: "blur",
            validator: telValidate
          }
        ],
        willingTime: [
          {
            trigger: "blur",
            required: true,
            message: "意愿时间必选"
          }
        ],
        clasz: [
          {
            trigger: "blur",
            required: true,
            message: "报名班级必选"
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
    /**
     * 导出excel
     */
    exportExcel() {
      if(!this.tableData.length) return;
      let json = {
        sname: this.studentForm.studentName,
        clasz: this.studentForm.classes,
        sex: this.studentForm.sex
      };
      this.getStudentExcel(json);
    },

    /**
     * 导出学生列表方法
     */
    getStudentExcel(json) {
      this.$axios
        .get("/getStudentExcel", {
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
            //   prop: 'sid',
            //   label: 'id'
            // },
            {
              prop: "sname",
              label: "姓名"
            },
            {
              prop: "sex",
              label: "性别",
              formatter: row => {
                return parseInt(row.sex) === 1 ? "男" : "女";
              }
            },
            {
              prop: "clasz",
              label: "所属班级",
              formatter: row => {
                return util.getArrVal(
                  this.studentForm.claszOption,
                  "clid",
                  "clname",
                  row.clasz
                );
              }
            },
            {
              prop: "period_total",
              label: "已买课时",
              formatter: row => {
                return row.period_total + "";
              }
            },
            {
              prop: "period_surplus",
              label: "剩余课时"
            },
            {
              prop: "parent",
              label: "家长姓名"
            },
            {
              prop: "sphone",
              label: "联系电话"
            },
            {
              prop: "nvitation_code",
              label: "邀请码"
            }
          ],
          // 查看详情事件
          showDetail: scope => {
            const id = scope.row.sid;
            this.$router.push({
              path: "/home/detail/students/" + id + "?type=view"
            });
          },

          editDetail: scope => {
            const id = scope.row.sid;
            this.$router.push({
              path: "/home/detail/students/" + id + "?type=edit"
            });
          },

          delete: scope => {
            const id = scope.row.sid;

            this.$confirm("此操作将删除该学员, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.deleteStudent(id);
            });
          }
        };
        this.getStudentData();
    },

    // 打开新建弹窗
    newItem() {
      console.log(1);
        if (this.$refs.studentForm) {
          this.$refs.studentForm.resetFields();
        }
        this.resetNewStudents();
        this.getClass();
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
        birthday: "",
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
        this.$confirm("此操作将删除学员, 是否确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteStudent(this.selectedId.join(","));
          console.log("删除学生");
        });
      } else {
        this.$message("请至少选择一项");
      }
    },

    // 学生dialog确认
    confirm() {
      this.$refs.newStudentForm.validate(validate => {
        if (validate) {
          this.newStudent();
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

    // 获取学生
    getStudentData() {
      // this.tableData = []
      this.loading = true;
      let propsData = {
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          sname: this.studentForm.studentName,
          clasz: this.studentForm.classes,
          sex: this.studentForm.sex
        }
        console.log('propsData', propsData);
      this.$axios
        .post("/getStudentsByPage", propsData)
        .then(res => {
          console.log('sres', res);
          this.loading = false;
          this.total = res.data.total;
          this.tableData = res.data.rows;
        });
    },


    // 新建会员
    newStudent() {
      let json = {
        sname: this.newStudentForm.studentName,
        sex: this.newStudentForm.sex,
        birthday: this.newStudentForm.birthday,
        period_total: this.newStudentForm.period_total,
        period_surplus: this.newStudentForm.period_total,
        parent: this.newStudentForm.parentName,
        sphone: this.newStudentForm.tel,
        school: this.newStudentForm.school,
        home_address: this.newStudentForm.address,
        studytime: this.newStudentForm.willingTime.join(","),
        train_class: this.newStudentForm.train_class,
        clasz: this.newStudentForm.clasz
      };

      this.$axios.post("/insertOneStudent", json).then(res => {
        if (res && res.data) {
          if (parseInt(res.data.code) === 1) {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.getStudentData();
            this.newStudentForm.visible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },

    // 删除会员
    deleteStudent(id) {
      this.$axios.post("/deleteStudent", { sid: id }).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
        this.getStudentData();
      });
    },

  },

  watch: {
    $route: {
      deep: true,
      handler(route) {
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
