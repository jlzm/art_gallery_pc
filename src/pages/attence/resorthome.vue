<template>
  <div class="resorthome">
    <div class="search">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addNewResort()">新增排班</el-button>
    </div>
    <div class="tables">
      <tables
        :tableOption="tableOption"
        :backData="tableData"
        :tableData="tableData"
        @pageChange="pageChange"
        @handleSelectionChange="selectChange"
        :total="total"
        pageType="back"
      ></tables>
    </div>
    <div v-if="dialogFormVisible" class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :model="addForm"
          class="form-inline"
          ref="addForm"
          :label-position="'left'"
          label-width="80px"
          :rules="rule"
        >
          <el-form-item label="班次名称" required prop="className">
            <el-select v-model="addForm.className" placeholder="请选择班次" size="small">
              <el-option
                v-for="item in addForm.classNameOptions"
                :key="item.wid"
                :label="item.wname"
                :value="item.wid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用人员" prop="fitPeople">
            <el-select
              v-model="addForm.fitPeople"
              placeholder="请选择适用人员"
              size="small"
              multiple
              filterable
            >
              <el-option
                v-for="item in addForm.fitPeopleOptions"
                :key="item.tid"
                :label="item.tname"
                :value="item.tid"
                size="small"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作周期" prop="circle">
            <el-date-picker
              v-model="addForm.circle"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
            <div class="form-tip" v-show="showCircleTips">提示：选择周期是指该排班的起始日期，默认选择时间段为上班日期</div>
          </el-form-item>
          <el-form-item label="休息日期" prop="rest">
            <el-date-picker
              type="dates"
              v-model="addForm.rest"
              placeholder="选择一个或多个休息日期"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
            <div class="form-tip" v-show="showRestTips">提示：选择需要休息的日期</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
import { mapState } from "vuex";

export default {
  name: "resorthome",
  mixins: [mixin],
  mounted() {
    this.initTable();
    // 获取班次名称及id
    this.getResort();
    // 获取老师
    this.getTeacherData();
    // 获取表格信息
    this.getData();
  },
  data() {
    const requireValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择工作周期"));
        this.showCircleTips = false;
      } else {
        if (!value[0] || !value[1]) {
          callback(new Error("请选择工作周期"));
        } else {
          this.showCircleTips = true;
          callback();
        }
      }
    };
    const restValidate = (rule, value, callback) => {
      if (value && value.length) {
        if (!this.addForm.circle.length) {
          callback(new Error("请先选择工作周期"));
          this.showRestTips = false;
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      tableOption: {},
      tableData: [],
      dialogFormVisible: false,
      dialogTitle: "新增排班",
      showCircleTips: true,
      editType: "new",
      showRestTips: true,
      addForm: {
        waid: "",
        className: "",
        classNameOptions: [],
        fitPeople: [],
        fitPeopleOptions: [],
        circle: "",
        rest: []
      },
      rule: {
        className: [
          { required: true, message: "请选择班次名称", trigger: "blur" }
        ],
        fitPeople: [
          { required: true, message: "请选择适用人员", trigger: "blur" }
        ],
        circle: [
          {
            validator: requireValidate,
            message: "请选择工作周期",
            trigger: "change"
          },
          { required: true, message: "请选择工作周期", trigger: "blur" }
        ],
        // rest: [
        //   { validator: restValidate, trigger: "change" },
        //   { required: true, message: "请选择休息日期", trigger: "blur" }
        // ]
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
    initTable() {
      this.tableOption = {
        isMutiple: false,
        showIndex: true,
        showOpr: true,
        showEditBtn: true,
        showDelBtn: true,
        column: [
          {
            prop: "wname",
            label: "班次名称",
            width: 150
          },
          {
            prop: "classTime",
            label: "班次时间",
            formatter(row) {
              return row.ontime + " - " + row.offtime;
            }
          },
          {
            prop: "period",
            label: "工作周期",
            formatter(row) {
              return row.ondate + " - " + row.offdate;
            }
          },
          {
            prop: "username",
            label: "排班人员"
          },
          {
            prop: "unames",
            label: "适用人员",
            tooltip: true
          }
        ],
        editDetail: item => {
          console.log(item);
          this.showEditDialog(item.row);
        },
        delete: scope => {
          const id = scope.row.waid;

          this.$confirm("此操作将删除该排班, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.deleteAttendance(id);
          });
        }
      };
    },

    /**
     * 打开修改界面
     */
    showEditDialog(row) {
      this.editType = "edit";
      this.dialogTitle = "修改排班";
      this.fillFormData(row);
      this.dialogFormVisible = true;
    },

    /**
     * 填充修改属性
     */
    fillFormData(row) {
      console.log(row);
      this.addForm.waid = row.waid;
      this.addForm.className = row.wid;
      this.addForm.fitPeople = row.uids.split(",");
      this.addForm.circle = [`${row.ondate}`, `${row.offdate}`];
      this.addForm.rest = row.restdate.split(",");
    },

    deleteAttendance(id) {
      let json = {
        waid: id
      };
      this.$axios.post("/deleteWorkArrange", json).then(res => {
        console.log(res);
        if (res && res.data && parseInt(res.data.code) === 1) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    addNewResort() {
      // this.$router.push({
      //   name: 'addNewResort'
      // })
      this.editType = "new";
      this.dialogFormVisible = true;
      this.dialogTitle = "新增排班";
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields();
      }
      this.resetNewForm();
    },

    /**
     * 重置新建数据
     */
    resetNewForm() {
      this.addForm.className = "";
      this.addForm.fitPeople = [];
      this.addForm.circle = "";
      this.addForm.rest = [];
    },

    // 分页
    // 表格分页
    pageChange(val) {
      this.pageJSON = val;
      this.getData();
    },

    // 批量删除
    selectChange(val) {
      this.deleteStr = "";
      if (val && val.length) {
        val.forEach(item => {
          this.deleteStr += item.crid;
        });
      }
    },

    /** 新建考勤排班 */
    confirm() {
      this.$refs.addForm.validate(validate => {
        if (validate) {
          let json = {
            waid: this.addForm.waid,
            wid: this.addForm.className,
            ondate: this.addForm.circle[0],
            offdate: this.addForm.circle[1],
            userid: this.userInfo.uid,
            username: this.userInfo.uname,
            uids: this.addForm.fitPeople.join(","),
            restdate: this.addForm.rest.join(",")
          };
          console.log("json", json);

          if (this.editType === "new") {
            this.$axios.post("/insertWorkArrange", json).then(res => {
              console.log("res1", res);
              if (res && res.data && parseInt(res.data.code) === 1) {
                this.$message.success("新增成功");
                this.getData();
                this.dialogFormVisible = false;
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$axios.post("/updateWorkArrange", json).then(res => {
              console.log("res2", res);
              switch (res.data.code) {
                case 1:
                  this.$message.success("成功修改");
                  this.getData();
                  this.dialogFormVisible = false;
                  break;

                default:
                  this.$message.error(res.data.msg);
                  break;
              }
            });
          }
        }
      });
    },
    // 获取班次名称及id
    getResort() {
      this.addForm.classNameOptions = [];
      this.$axios.post("/getWorkTimeConfigList").then(res => {
        if (res && res.data && res.data.length) {
          this.addForm.classNameOptions = res.data;
        }
      });
    },
    // 获取老师
    getTeacherData() {
      this.addForm.fitPeopleOptions = [];
      this.$axios.post("/getTeacherSelectVul").then(res => {
        if (res && res.data.length) {
          this.addForm.fitPeopleOptions = res.data;
        }
      });
    },
    getData() {
      let json = Object.assign(
        {},
        {
          ctype: 1,
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize
        }
      );
      this.tableData = [];
      this.$axios.post("/getWorkArrangeByPage", json).then(res => {
        console.log("res", res);
        if (res && res.data && res.data.total > 0) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
          this.pageJSON.crrentPage = res.data.crrentPage;
          this.pageJSON.pageSize = res.data.pageSize;
        }
      });
    }
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  }
};
</script>

<style scope>
.resorthome .dialog /deep/ .el-dialog {
  width: 550px;
}

.resorthome .dialog /deep/ .el-select,
.resorthome .dialog /deep/ .el-date-editor {
  width: 100%;
}

.resorthome .dialog /deep/ .el-range-editor .el-range-input {
  text-align: left;
}

.resorthome .form-tip {
  height: 15px;
  line-height: 26px;
  color: #9e9e9e;
}
</style>
