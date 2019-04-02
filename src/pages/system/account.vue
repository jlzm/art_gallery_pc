<template>
  <div class="uid">
    <div class="search">
      <el-form :inline="true" :model="accountForm" class="form-inline">
        <el-form-item label="账号">
          <el-input v-model="searchForm.uid" placeholder="输入账号" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.uname" placeholder="输入姓名" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item class="oprator">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showNewUser()">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <tables :tableOption="tableOption" :tableData="tableData"></tables>
    </div>
    <div v-if="accountFormVisible" class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="accountFormVisible"
        :close-on-click-modal="false"
        width="350px"
      >
        <el-form
          :model="accountForm"
          ref="accountForm"
          :label-position="'left'"
          label-width="80px"
          :rules="rule"
        >
          <el-form-item label="账号" v-if="accountForm.type != 'edit'" prop="uid">
            <el-input v-model="accountForm.uid" size="small"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="uname">
            <el-input v-model="accountForm.uname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="accountForm.password" size="small" show-password></el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item label="确认密码" required prop="checkPassword">
            <el-input v-model="accountForm.checkPassword" size="small" show-password></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="accountFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";

export default {
  uname: "uid",
  mixins: [mixin],
  mounted() {
    this.initTable();
    this.tableData = [];
  },
  data() {
    var ckeckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.accountForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表格配置
      tableOption: {},
      tableData: [],
      dialogTitle: "新建账号",
      accountFormVisible: false,
      searchForm: {
        uid: "",
        uname: ""
      },
      accountForm: {
        type: "new",
        uid: "",
        uname: "",
        password: "",
        checkPassword: ""
      },
      rule: {
        uid: [
          {
            trigger: "blur",
            message: "请输入账号",
            required: true
          }
        ],
        uname: [
          {
            trigger: "blur",
            message: "请输入姓名",
            required: true
          }
        ],
        password: [
          {
            trigger: "blur",
            message: "请输入密码",
            required: true
          }
        ],
        checkPassword: [
          {
            trigger: "blur",
            validator: ckeckPass
          }
        ]
      },
      showPas: false
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
            prop: "uid",
            label: "账号"
          },
          {
            prop: "uname",
            label: "姓名"
          },
          {
            prop: "instime",
            label: "创建时间",
            formatter(row) {
              return row.instime && row.instime.slice(0, -2);
            }
          }
        ],

        // 编辑账号
        editDetail: data => {
          this.showEditUser(data.row);
        },

        // 删除账号
        delete() {
          console.log(1);
        }
      };
      this.getTableData();
    },

    /**
     * 打开编辑账号
     */
    showEditUser(row) {
      console.log(row);
      this.accountForm.type = "edit";
      this.dialogTitle = "编辑账户";
      this.accountForm.uname = row.uname;
      this.accountForm.uid = row.uid;
      this.$nextTick(() => {
        if (this.$refs.accountForm) {
          this.$refs.accountForm.resetFields();
        }
      });
      this.accountFormVisible = true;
    },

    /**打开新建账号 */
    showNewUser() {
      this.accountForm.type = "new";
      this.dialogTitle = "新建账户";
      this.resetNewForm();
      this.$nextTick(() => {
        if (this.$refs.accountForm) {
          this.$refs.accountForm.resetFields();
        }
      });
      this.accountFormVisible = true;
    },

    showModal() {},

    /**
     * 重置新建数据
     */
    resetNewForm() {
      this.accountForm.uid = "";
      this.accountForm.uname = "";
      this.accountForm.password = "";
      this.accountForm.checkPassword = "";
    },

    togglePas() {
      this.showPas = !this.showPas;
    },

    /**
     * 新建或修改账号
     */
    insertUser() {

      let propsData = {
        uid: this.accountForm.uid,
        uname: this.accountForm.uid,
        password: this.accountForm.password
      };

      this.$refs.accountForm.validate(validate => {
        if (validate) {
          switch (this.accountForm.type) {
            case "new":
              this.$axios.post("/insertUser", this.propsData).then(res => {
                if (res && res.data && parseInt(res.data.code) === 1) {
                  this.$message.success("新增用户成功");
                  this.getTableData();
                  this.accountFormVisible = false;
                } else {
                  this.$message.error(res.data.msg);
                }
              });
              break;

            case "edit":
              this.$axios.post("/updateUserInfo", propsData).then(res => {
                console.log("res", res);
                switch (res.data.code) {
                  case 1:
                    this.$message.success("成功修改账号");
                    this.getTableData();
                    this.accountFormVisible = false;
                    break;

                  default:
                    this.$message.error(res.data.msg);
                    break;
                }
              });
            default:
              break;
          }
        }
      });
    },

    /**
     * 获取账号数据
     *  */
    getTableData() {
      this.tableData = [];
      this.$axios.post("/getAllUser", this.searchForm).then(res => {
        if (res && res.data && res.data.length) {
          this.tableData = res.data;
        } else {
          this.$message.info("没有查到相关数据");
        }
      });
    }
  }
};
</script>

<style scope>
.uid {
  padding: 15px;
  background-color: #fff;
}
</style>
