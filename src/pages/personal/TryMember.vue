<template>
  <div>
    <div class="personal-content">
      <div class="search">
        <!-- 试听人员查询表格 -->
        <el-form
          @submit.native.prevent="getTryData()"
          :inline="true"
          :model="newTryForm"
          class="form-inline"
          ref
        >
          <el-form-item label="试听人员姓名">
            <el-input v-model="newTryForm.sname" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click.native.stop="getTryData()"
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
      <!-- 新建试听会员  -->
      <el-dialog
        :title="newTryForm.title"
        :visible.sync="newTryForm.visible"
        :close-on-click-modal="false"
        width="400px"
      >
        <el-form
          :disabled="newTryForm.disabled"
          :model="newTryForm"
          class="form-inline"
          ref="newTryForm"
          label-position="left"
          label-width="80px"
          :rules="teacherRule"
        >
          <el-form-item label="姓名" prop="sname">
            <el-input v-model="newTryForm.sname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="newTryForm.birthday"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="家长姓名" prop="parent">
            <el-input v-model="newTryForm.parent" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="sphone">
            <el-input v-model="newTryForm.sphone" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('newTryForm')">取 消</el-button>
          <el-button type="primary" @click="editTeacher()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
import util from "@/util/util";

import exportExcel from "../../mixins/exportExcel.js";

export default {
  name: "teacher",
  mixins: [mixin, exportExcel],
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
        claszOption: []
      },
      teacherForm: {
        sname: ""
      },

      // 新建试听会员
      newTryForm: {
        parent: "",
        tlid: "",
        sphone: "",
        visible: false,
        birthday: "",
        sname: "",
        title: "新增试听会员",
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
        sname: [
          {
            // trigger: 'blur',
            required: true,
            message: "试听人员姓名必填"
          }
        ],
        sphone: [
          {
            // trigger: 'blur',
            required: true,
            message: "联系电话必填"
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
    exportExcel() {
      const url = "exportTrylistenExcel";
      let propsData = {
        sname: this.newTryForm.sname
      };

      this.getStudentExcel(url, propsData);
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
            prop: "sname",
            label: "姓名"
          },
          {
            prop: "age",
            label: "年龄"
          },
          // {
          //   prop: "birthday",
          //   label: "生日"
          // },
          {
            prop: "parent",
            label: "家长姓名"
          },
          {
            prop: "sphone",
            label: "电话号码"
          }
        ],
        // 查看详情事件
        showDetail: scope => {
          this.newTryForm = {
            title: "详情",
            visible: true,
            sname: scope.row.sname,
            birthday: scope.row.birthday,
            age: scope.row.age,
            sphone: scope.row.sphone,
            parent: scope.row.parent,
            disabled: true
          };
          this.oprType = "show";
        },
        editDetail: scope => {
          console.log("scope", scope);
          this.newTryForm = {
            title: "编辑详情",
            visible: true,
            birthday: scope.row.birthday,
            sname: scope.row.sname,
            parent: scope.row.parent,
            age: scope.row.age,
            sphone: scope.row.sphone,
            tlid: scope.row.tlid,
            disabled: false
          };
          this.oprType = "edit";
        },
        delete: scope => {
          this.$confirm("此操作将删除该试听人员, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.deleteTeacher(scope.row.tlid);
          });
        }
      };
      this.getTryData();
    },

    // 打开新建弹窗
    newItem() {
      this.oprType = "new";
      if (this.$refs.newTryForm) {
        this.$refs.newTryForm.resetFields();
      }
      this.resetNewStudents();
      this.newTryForm.visible = true;
    },

    resetNewStudents() {
      this.newTryForm.tlid = '';
      this.newTryForm.birthday = '';
      this.newTryForm.sname = '';
      this.newTryForm.parent = '';
      this.newTryForm.sphone = '';
    },

    // 多选表格
    selectChange(val) {
      console.log("selectedId", this.selectedId);
      this.selectedId = val.map(item => {
        return item.tlid;
      });
    },

    // 批量删除
    deleteAll() {
      if (this.selectedId.length) {
        this.$confirm("此操作将删除教师, 是否确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteTeacher(this.selectedId.join(","));
          console.log("删除试听人员");
        });
      } else {
        this.$message("请至少选择一项");
      }
    },

    // 编辑试听会员
    editTeacher() {
      this.$refs.newTryForm.validate(validate => {
        if (validate) {
          let json = {
            tlid: this.newTryForm.tlid,
            birthday: this.newTryForm.birthday,
            sname: this.newTryForm.sname,
            parent: this.newTryForm.parent,
            sphone: this.newTryForm.sphone
          };
          console.log("json", json);
          let url;
          switch (this.oprType) {
            case "new":
              url = "/insertOneTrylisten";
              break;
            case "edit":
              url = "/updateOneTrylisten";
              json.tlid = this.newTryForm.tlid;
              break;
            case "show":
            default:
              this.newTryForm.visible = false;
          }
          this.postTeacher(json, url);
          this.resetForm("newTryForm");
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
      this.getTryData();
    },

    /** API */
    // 新建学生api
    postTeacher(json, url) {
      this.$axios.post(url, json).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getTryData();
          this.newTryForm.visible = false;
          this.resetForm("newTryForm");
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

    // 获取试听会员列表
    getTryData() {
      this.tableData = [];
      this.loading = true;
      let propsData = {
        page: this.pageJSON.currentPage,
        rows: this.pageJSON.pageSize,
        sname: this.newTryForm.sname
      };
      this.$axios.post("/getTrylistenByPage", propsData).then(res => {
        console.log("tres", res);
        this.loading = false;
        if (res && res.data.rows && res.data.rows.length) {
          this.total = res.data.total;
          this.tableData = res.data.rows;
        }
      });
    },

    /** 删除试听人员 */
    deleteTeacher(id) {
      console.log("id", id);
      this.$axios.post("/deleteTrylisten", { tlid: id }).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
        this.getTryData();
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
