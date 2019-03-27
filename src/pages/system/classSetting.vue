<template>
  <div class="sys-class-setting">
    <div class="search">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="newClass">新建</el-button>
    </div>
    <div class="tables">
      <tables :tableOption="tableOption" :tableData="tableData"></tables>
    </div>
    <div  class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="classSettingFormVisible"
        :close-on-click-modal="false"
        width="400px"
      >
          <el-form
          
          :model="classSettingForm"
          class="form-inline"
          ref="classSettingForm"
          :label-position="'left'"
          label-width="80px"
          :validate-on-rule-change="false"
          :rules="rule"
        >
          <el-form-item label="班级名称" required prop="clname">
            <el-input v-model="classSettingForm.clname" ref="clname" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="classSettingFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
export default {
  name: "sysClassSetting",
  mixins: [mixin],
  mounted() {
    this.initTable();
  },
  data() {
    return {
      tableOption: {},
      tableData: [],
      dialogTitle: "新建班级设置",
      classSettingFormVisible: false,
      classSettingForm: {
        clname: "",
        clid: "",
        number: 0
      },
      rule: {
        clname: [
          {
            required: true,
            trigger: "blur",
            message: "班级名称必填"
          }
        ]
      },
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
          {
            prop: "clid",
            label: "班级ID"
          },
          {
            prop: "clname",
            label: "班级名称"
          },
          {
            prop: "number",
            label: "班级已有人数",
            formatter(value) {
              return value.number + "人";
            }
          }
        ],
        editDetail: scope => {
          this.dialogTitle = "修改班级设置";
          this.classSettingFormVisible = true;
          this.classSettingForm = {
            clname: scope.row.clname,
            clid: scope.row.clid,
            number: scope.row.number
          };
          this.type = "edit";
        },
        delete: scope => {
          this.$confirm("此操作永久删除该班级, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.deleteClass(scope.row.clid);
          });
        }
      };
      this.getTableData();
    },

    /**
     * 新建教室
     */
    newClass() {
      this.type = "new";
      this.classSettingFormVisible = true;

      if(this.$refs.classSettingForm) {
        this.$refs.classSettingForm.resetFields();
      }

      this.classSettingForm.clname = '';

    },

    /**
     * 修改
     */
    confirm() {
      if (this.type === "new") {
        this.insertClass();
      } else {
        this.editClass();
      }
    },
    
    /** API */
    insertClass() {
      this.$refs.classSettingForm.validate(validate => {
        if (validate) {
          this.classSettingFormVisible = false;
          this.$axios
            .post("/insertClass", {
              clname: this.classSettingForm.clname
            })
            .then(res => {
              if (res && parseInt(res.data.code) === 1) {
                this.$message({
                  message: "新增班级成功",
                  type: "success"
                });
                this.classSettingFormVisible = false;
              } else {
                this.$message.error(res.data.msg);
              }
              this.$refs.classSettingForm.resetFields();
              this.getTableData();
            });
        }
      });
    },
    
    /** 修改班级 */
    editClass() {
      this.$refs.classSettingForm.validate(validate => {
        if (validate) {
          this.classSettingFormVisible = false;
          this.$axios.post("/updateClass", this.classSettingForm).then(res => {
            if (res && parseInt(res.data.code) === 1) {
              this.$message({
                message: "修改班级成功",
                type: "success"
              });
              this.classSettingFormVisible = false;
              
            } else {
              this.$message.error(res.data.msg);
            }
            this.$refs.classSettingForm.resetFields();
            this.getTableData();
          });
        }
      });
    },
    deleteClass(id) {
      this.$axios
        .post("/deleteClass", {
          clid: id
        })
        .then(res => {
          if (res.data && parseInt(res.data.code) === 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getTableData();
        });
    },
    getTableData() {
      this.tableData = [];
      this.tableOption.loading = true;
      this.$axios.post("/getClass").then(res => {
        this.tableOption.loading = false;
        if (res && res.data && res.data.length) {
          this.tableData = res.data;
        }
      });
    }
  }
};
</script>

<style scope>
.sys-class-setting {
  padding: 15px;
  background-color: #fff;
}
.sys-class-setting /deep/ .el-form {
  padding: 0 20px;
}
.sys-class-setting .dialog /deep/ .el-input-number {
  width: 100%;
}
</style>
