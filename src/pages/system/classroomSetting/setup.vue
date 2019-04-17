<template>
  <div class="setup">
    <div class="search">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="newSetUpBtn">新建</el-button>
    </div>
    <div class="tables">
      <tables :tableOption="tableOption" :tableData="tableData"></tables>
    </div>
    <div class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="setUpFormVisible"
        :close-on-click-modal="false"
        width="350px"
      >
        <el-form
          :rules="rule"
          :model="setUpForm"
          ref="setUpForm"
          :label-position="'left'"
          label-width="80px"
        >
          <el-form-item label="教室名称" required prop="className">
            <el-input v-model="setUpForm.className" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../../mixins/tableMixin";
export default {
  name: "setup",
  mixins: [mixin],
  mounted() {
    this.initTable();
  },
  data() {
    return {
      tableOption: {},
      tableData: [],
      dialogTitle: "新建教室设置",
      setUpFormVisible: false,
      setUpForm: {
        className: "",
        classId: ""
      },
      rule: {
        className: [
          {
            trigger: "blur",
            message: "教室名称必填",
            required: true
          }
        ]
      },
      // 状态 编辑或者新增
      type: "new"
    };
  },
  methods: {
    initTable() {
      this.tableOption = {
        isMutiple: false,
        showIndex: true,
        showOpr: true,
        showDelBtn: true,
        showEditBtn: true,
        column: [
          // {
          //   prop: "rid",
          //   label: "教室ID"
          // },
          {
            prop: "rname",
            label: "教室名称",
            width: "500px"
          }
        ],
        editDetail: scope => {
          this.setUpFormVisible = true;
          this.dialogTitle = "编辑教室设置";
          this.setUpForm.className = scope.row.rname;
          this.setUpForm.classId = scope.row.rid;
          this.type = "edit";
        },
        delete: scope => {
          this.$confirm("此操作将删除教室，是否继续操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.deleteSetUp(scope.row.rid);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        },
        loading: false
      };
      this.getSetUp();
    },
    cancelDialog() {
      this.setUpFormVisible = false;
    },

    newSetUpBtn() {
      this.type = "new";

      this.setUpFormVisible = true;
      if (this.$refs.setUpForm) {
        this.$refs.setUpForm.resetFields();
      }
      this.setUpForm.className = "";
    },
    // 确定点击
    confirm() {
      if (this.type === "new") {
        this.newSetUp();
      } else {
        this.editSetUp();
      }
    },
    /** API */
    newSetUp() {
      this.$axios
        .post("/insertRoom", {
          rname: this.setUpForm.className
        })
        .then(res => {
          if (res && res.data) {
            if (parseInt(res.data.code) == 1) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.setUpFormVisible = false;
              this.getSetUp();
            } else {
              this.$message.error(res.data.msg);
            }
          }
        });
    },
    getSetUp() {
      this.tableOption.loading = true;
      this.$axios.post("/getRoom").then(res => {
        if (res && res.data.length) {
          this.tableData = res.data;
        }
        this.tableOption.loading = false;
      });
    },
    deleteSetUp(id) {
      this.$axios
        .post("/deleteRoom", {
          rid: id
        })
        .then(res => {
          if (res) {
            if (parseInt(res.data.code) === 1) {
              this.$message({
                message: "成功删除",
                type: "success"
              });
              this.getSetUp();
            } else {
              this.$message.error(res.data.msg);
            }
          }
        });
    },
    editSetUp(id) {
      this.$axios
        .post("/updateRoom", {
          rid: this.setUpForm.classId,
          rname: this.setUpForm.className
        })
        .then(res => {
          if (res) {
            if (res) {
            if (parseInt(res.data.code) === 1) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getSetUp();
            this.setUpFormVisible = false;

            } else {
              this.$message.error(res.data.msg);
            }
          } 
          }
        });
    }
  }
};
</script>

<style scope>
</style>
